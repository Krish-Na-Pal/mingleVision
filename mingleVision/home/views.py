from django.shortcuts import render, redirect
from home.models import Room
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMessage
from django.views import View
from django.core.mail import send_mail
from django.utils import timezone
import random

# from django.contrib import messages

# Create your views here.


#Renders

def home(request):
    return render(request,"home.html")

def lobby(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.method == "POST":
        roomName = request.POST.get('roomName')
        roomCode = request.POST.get('roomCode')
        try:
            room = Room(Room_Name = roomName,Room_Code = roomCode)
            room.created_by = request.user
            room.save()
            return redirect(f'/room?room={roomName}')
        except:
            messages.info(request,"➡️Room is already created!!!")
    return render(request, 'lobby.html')

def join(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.method == "POST":
        roomName = request.POST.get('roomName')
        roomCode = request.POST.get('roomCode')
        try:
            room = Room.objects.get(Room_Name=roomName)
            if roomCode == room.Room_Code:
                return redirect(f'/room?room={roomName}')
            else:
                messages.warning(request,"⚠️Incorrect Code...")
        except:
            messages.error(request,"🚫Room does not Exist!!!")
    return render(request,'join.html')

def room(request):
    print(request.user)
    if request.user.is_anonymous:
        return redirect('login')
    return render(request, 'room.html')

def user_rooms(request):
    if request.user.is_anonymous:
        return redirect('login')
    
    user = request.user
    user_rooms = Room.objects.filter(created_by=user)

    room_cards = []
    for room in user_rooms:
        print(timezone.now())
        print(room.created_at)
        time_ago = timezone.now() - room.created_at
        days = time_ago.days
        hours, seconds = divmod(time_ago.seconds, 3600)
        minutes, seconds = divmod(seconds, 60)

        if days == 0:
            if hours == 0:
                time_ago = f"{minutes} minutes ago"
            else:
                time_ago = f"{hours} hours ago"
        else:
            time_ago = f"{days} days ago"
        room_cards.append({
            'room_name': room.Room_Name,
            'room_code': room.Room_Code,
            'created_at': room.created_at,
            'time_ago': time_ago,
        })

    context = {
        'room_cards': room_cards
    }
    return render(request, 'user_rooms.html', context)

def deleteRoom(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.method == "POST":
        roomname = request.POST.get('roomName')
        try:
            room = get_object_or_404(Room, Room_Name=roomname)
            if request.user == room.created_by:
                room.delete()
                messages.success(request,"✅Room is removed...")
            else:
                messages.info(request,"➡️You are not creator of this room...")
        except:
            messages.error(request,"🚫Room does not Exist")
    return render(request,'deleteRoom.html')


#Authentication Renders
def register(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirmpassword = request.POST.get('confirmpassword')
        try:
            if password == confirmpassword:
                user = User.objects.create_user(username,email,password)
                user.save()
                messages.success(request,"✅Registration Successfull")
            else:
                messages.warning(request,"⚠️Passwords not matched")
        except:
            messages.error(request,"Registration failed")
    return render(request,'register.html')

def loginUser(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username,password=password)
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            try:
                username = User.objects.get(username=username)
                messages.warning(request,"⚠️Password is incorrect")  
            except: 
                messages.error(request,"🚫User Does Not Exist!!!")
    return render(request,'login.html')

#Log Out 
def logoutUser(request):
    logout(request)
    return redirect('login')

#for changing password

class ResetPasswordView(View):

    def get(self, request):
        return render(request, 'reset_password.html', {'step': 'send_code'})

    def post(self, request):
        if 'send_code' in request.POST:
            try:
                username = request.POST['username']
                user = User.objects.get(username=username)
                code = str(random.randint(1000000, 9999999))
                request.session['reset_code'] = code
                send_mail(
                    'OTP from MingleVision',
                    f'Your OTP for reset password: {code}',
                    'minglevision1508@gmail.com',
                    [user.email],
                    fail_silently=False,
                )
                return render(request, 'reset_password.html', {'step': 'verify_code'})
            except:
                messages.error(request,"🚫User Not Found!!!")

        elif 'reset_password' in request.POST:
            try:
                username = request.POST['username']
                code_entered = request.POST['code']
                new_password = request.POST['new_password']
                session_code = request.session.get('reset_code', None)
                if code_entered == session_code:
                    user = User.objects.get(username=username)
                    user.set_password(new_password)
                    user.save()
                    del request.session['reset_code']
                    messages.success(request,"✅Password reset successful")
                else:
                    messages.error(request,"⚠️Code is not valid!!!")
            except:
                messages.error(request,"🚫Username is not valid!!!")

        return render(request, 'reset_password.html')