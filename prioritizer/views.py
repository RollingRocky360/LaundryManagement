import django
from django.shortcuts import render
from django.http import HttpRequest

def login(request):
    return render (
        request, 
        'prioritizer/index.html', 
        {
            'containerAnimation': 'container-animation', 
            'innerAnimation': 'inner-animation'
        }
    )

def home(request: HttpRequest):
    if request.method == 'POST':
        if request.POST['username'] == 'manager' and request.POST['password'] == 'manager':
            return render(request, 'prioritizer/mainpage.html')
        else:
            return render (
                request, 
                'prioritizer/index.html', 
                {
                    'loginerror': True, 
                    'containerAnimation': '',
                    'innerAnimation': '',
                }
            )
    else:
        return render(request, 'prioritizer/fourofour.html')

