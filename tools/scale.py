#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
NAME
    scale.py -i 1 (960*540)
    scale.py -i 2 (1280*720)
SYNOPSIS
    scale.py  -i [1,2]
"""

import os
import getopt
import sys
from PIL import Image


#脚本所在路径
scriptRoot = os.path.split(os.path.realpath(__file__))[0]
#输出文件夹
outputDir = os.path.join(scriptRoot, "output")
#创建输出文件夹
if (os.path.isdir(outputDir)==False): 
    os.mkdir(outputDir) 
#忽略的路径
ignoreDir = [outputDir]
#scale方式
scaleType = 3;


def joinDir(root, *dirs):
    for item in dirs:
        root = os.path.join(root, item)
    return root

def scale(root):
    files = os.listdir(root)
    for f in files:
        itemPath = joinDir(root, f)
        if os.path.isdir(itemPath):
            if (f[0] == '.' or (f in ignoreDir)):
                pass
            else:
                scale(itemPath)
        elif os.path.isfile(itemPath):
            filepath,filename = os.path.split(itemPath) 
            prefix,surffix = os.path.splitext(filename) 
            if surffix == '.png' or surffix == '.jpg':
                im = Image.open(itemPath) 
                w,h = im.size
                if scaleType == 1:
                    im_ss = im.resize((int(w*0.5), int(h*0.5)))
                elif scaleType == 2:
                    im_ss = im.resize((int(w*2/3), int(h*2/3)))
                elif scaleType == 3:
                    im_ss = im.resize((int(w*0.75), int(h*0.75)))
                im_ss.save(outputDir+os.sep+prefix+surffix)

if __name__=='__main__':
    # ===== parse args =====
    try:
        opts, args = getopt.getopt(sys.argv[1:], "i:")
        for o, a in opts:
            if o == '-i':
                if a == "1":
                    scaleType = 1;#960*540
                elif a == "2":
                    scaleType = 2;#1280*720
                elif a == "3":
                    scaleType = 3;#1440*810
                
        if scaleType == 0:
            print __doc__
            sys.exit(-2)
        else:
            scale(scriptRoot)
            if scaleType == 1:
                print(u"缩放图片960*540成功")
            elif scaleType == 2:
                print(u"缩放图片1280*720成功")
            elif scaleType == 3:
                print(u"缩放图片1440*810成功")
            else:
                print(u"缩放图片失败")
    except getopt.GetoptError:
        # print help information and exit:
        print __doc__
        sys.exit(-2)