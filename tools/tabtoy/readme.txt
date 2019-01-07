tabtoy 导表工具
学习地址：https://github.com/davyxu/tabtoy https://github.com/davyxu/tabtoy/blob/master/doc/Manual_V2.md
--combinename=Config 合并 A+B
bat 调整
.\tabtoy.exe ^
--mode=exportorv2 ^
--json_out=.\Config.json ^
--lua_out=.\Config.lua ^
--pbt_out=.\Config.pbt ^
--csharp_out=.\Config.cs ^
--proto_out=.\Config.proto ^
--binary_out=.\Config.bin ^
--lan=zh_cn ^
Prop.xlsx 

@IF %ERRORLEVEL% NEQ 0 pause