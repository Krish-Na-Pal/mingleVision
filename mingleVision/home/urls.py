from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('lobby',views.lobby),
    path('room', views.room),
    path('join', views.join),
    path('deleteRoom', views.deleteRoom),
    path('login',views.loginUser,name="login"),
    path('logout',views.logoutUser,name="logout"),
    path('register',views.register,name="register"),
    # path('forgotpassword',views.forgotpassword,name="forgotpassword"),
    path('reset-password', views.ResetPasswordView.as_view(), name='reset-password'),
    path('user-rooms', views.user_rooms, name='user_rooms'),
    # path('',views.home,name="home"),
]