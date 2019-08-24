# Simple-MXview-Interface

## Disclaimer 

Should this article infringe any copyright issues, please send me an email. I will take it down immediately.
You may reach me at lekingz94@gmail.com. Some image details have been removed to avoid violating any copyright issues.

## Overview
This article focuses on recreating a simpler version of MXview interface using MXview API. The final result is
shown below.
![](APIweb-whole-1.png)

## Steps:
1) Created a local server using Node.js Express module. 
    Source code:
      server.js
      
2) Developed a simple website for the server to host.
    Source code:
      index.html, style.css
      
3) Established a connection from local server to MXview server using Node.js Express over HTTP
    Source code:
      server.js
      
4) Made RESTful API requests from local server to MXview server using Node.js Requests.
    Source code:
      GetInfo.js
 
5) Obtained real-time event information from MXview server over socket.io.
    Source code:
      RTEvents.js
      
## Group Section
<img src="APIweb-group-1.png" width="200" height="300">
This section covers the entire structural tree of the users' configuration. The groups information
are obtained from an API request to MXview Server. An example code of API request is given below.

![](APIweb-group-code-1.png)
Where the request() function takes in the "options variable" which contains all the information required
to make a legit request to the server.

## Widget
![](APIweb-image-1.png)
This section covers the widget part of the website. The image part of the server is embedded into the
website which allows the user to interact with it. Changes made will be reflected in both the website and
the server.

## Evetns Section
