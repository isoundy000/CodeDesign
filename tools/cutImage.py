from PIL import Image
import sys  
import os.path  
from  datetime  import  *    
import random  
import time  

IMAGE_PATH = "test.png"

xIndex = 0
yIndex = 0
cropSize = 64
xNum = 0
yNum = 0

im = Image.open(IMAGE_PATH) 
pSize = im.size
 
xNum = pSize[0]/cropSize
yNum = pSize[1]/cropSize
 
print "size  " ,xNum,'  ',yNum
 
for yIndex in range(yNum):
	for xIndex in range(xNum):
		print "pic : " , xIndex , "_" , yIndex
		box = (xIndex*cropSize,yIndex*cropSize,(xIndex+1)*cropSize,(yIndex+1)*cropSize)
		print box
		region = im.crop(box)  
		#name = "map%s_%s.png" % (xIndex,yNum-1-yIndex)
		#cocoscreator 自动对齐方式
		#0
		#1
		#2
		#3
		#4 3 2 1 0
		name = "map%s_%s.png" % (xNum-1-xIndex,yIndex)
		region.save(name) 
		print int(time.time());  
