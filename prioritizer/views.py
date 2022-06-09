from django.shortcuts import render

def login(request):
    return render(request, 'prioritizer/index.html')

def home(request):
    return render(request, 'prioritizer/mainpage.html')