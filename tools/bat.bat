xcopy %cd%\resources\*.png %cd%\allPng\ /s

{
    "key": "alt+u",
    "command": "editor.action.transformToUppercase"
},
{
    "key": "shift+alt+u",
    "command": "editor.action.transformToLowercase"
}

/////////////////////////////////////////////////
rd /q /s C:\ProgramWork\CocosCreator\resources\engine\bin\.cache
xcopy %cd%\packagesDiff\cocosCreator\resourcesNew\*.*  C:\ProgramWork\CocosCreator\resources\ /s /e /y

xcopy %cd%\packagesDiff\web\*.* %cd%\ /s /e /y

%cd%/extra/tool/gitCommitCount/runSet.py
CocosCreator --path %cd% --build "platform=web-mobile"
CocosCreator --path %cd% --build "platform=web-desktop"
%cd%/extra/tool/gitCommitCount/runRecovery.py

cd extra/tool/pngCompress
web-desktop.py
web-desktop.py
web-mobile.py
web-mobile.py
cd ../../..

rd /q /s C:\inetpub\wwwroot\xmqgame\web-mobile
rd /q /s C:\inetpub\wwwroot\xmqgame\web-desktop
rd /q /s C:\inetpub\wwwroot\8001\web-desktop
rd /q /s C:\inetpub\wwwroot\8002\web-mobile
md C:\inetpub\wwwroot\8001\web-desktop
md C:\inetpub\wwwroot\8002\web-mobile
md C:\inetpub\wwwroot\8003\web-mobile
md C:\inetpub\wwwroot\8004\web-mobile
xcopy %cd%\build\*.* C:\inetpub\wwwroot\xmqgame\ /s /e /y
xcopy %cd%\build\web-desktop\*.* C:\inetpub\wwwroot\8001\web-desktop\ /s /e /y
xcopy %cd%\build\web-mobile\*.* C:\inetpub\wwwroot\8002\web-mobile\ /s /e /y
xcopy %cd%\build\web-mobile\*.* C:\inetpub\wwwroot\8003\web-mobile\ /s /e /y
xcopy %cd%\build\web-mobile\*.* C:\inetpub\wwwroot\8004\web-mobile\ /s /e /y