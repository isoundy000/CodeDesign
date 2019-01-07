.\tabtoy.exe ^
--mode=exportorv2 ^
--json_out=.\Config.json ^
--lan=zh_cn ^
Globals.xlsx ^
Prop.xlsx 



@IF %ERRORLEVEL% NEQ 0 pause
