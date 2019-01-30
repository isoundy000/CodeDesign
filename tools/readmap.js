//网易c++ 卡马克大地图加载算法

/*********************************************************************************************
*                                         网易公司西游系列
*                《梦幻西游》《大话西游II》《大话西游3内测版》《大话西游3正式版》
*                                        地图文件格式读取类
*---------------------------------------------------------------------------------------------
*
*                                           版本 4.0.0
*
*                                     王大理 &lt;wdl@sina.com&gt;
*                                            &lt;QQ:598337462&gt;
*
*---------------------------------------------------------------------------------------------
* 声明：
*     本源代码应用于网易公司的网络游戏：《梦幻西游》、《大话西游II》、《大话西游3内测版》和
*《大话西游3正式版》地图文件格式的读取。与此源代码相应的文件格式版权属于网易公司所有。
*     此源代码仅应用于教育目的，禁止用于商业目的，否则后果自负，本源代码作者不承担任何责任。
* 如有异议或应用于其他目的请务使用本源代码，并永久删除此源代码。
*---------------------------------------------------------------------------------------------
*                         版权所有(c) 2003-2007 王大理，保留所有权利。
*********************************************************************************************/
#pragma once
//=========== 包含文件 ============
#include <stdio.h>;
#include <math.h>;
#include <iostream>;
#include <fstream>;
#include <string>;
//=================================

//========= 定义数据类型 ==========
typedef long long                        int64;
typedef unsigned long long        uint64;
typedef int                                        int32;
typedef unsigned int                uint32;
typedef short                                int16;
typedef unsigned short                uint16;
typedef char                                int8;
typedef unsigned char                uint8;
//=================================

using namespace std; // 使用C++标准文件头

namespace NetEase
{
        // 地图的文件头(梦幻、大话2)
        class MapHeader1
        {
        public:
                uint32                Flag;                //文件标志
                uint32                Width;                //地图宽
                uint32                Height;                //地图高        
        };

        // 地图的文件头(大话3)
        class MapHeader3
        {
        public:
                // 文件头结构共40字节
                uint32                Flag;                                // 文件标志 0.3M (M3.0) 0x524F4C30
                uint32                Reserved;                        // 保留(未知作用,应该都为0)
                uint32                Width;                                // 地图实际的宽度
                uint32                Height;                                // 地图实际的高度
                uint16                PointWidth;                        // 坐标的宽度(默认：20px)
                uint16                PointHeight;                // 坐标的高度(默认：20px)
                uint16                SubWidth;                        // 小地图的宽度(默认：400px)
                uint16                SubHeight;                        // 小地图的高度(默认：320px)
                uint32                UnitIndexOffset;        // 单元引索的位置
                uint32                UnitIndexNum;                // 单元引索的数量
                uint32                IndexOffset;                // 引索的位置(未知部分)
                uint32                IndexNum;                        // 引索的数量(未知部分)
        };

        // ROL0的文件头(大话3)
        class Rol0Header
        {
        public:
                // 外文件头结构共24字节
                uint32                Flag;                                // 文件标志 0LOR (ROL0) 0x524F4C30
                uint32                Reserved;                        // 保留(未知作用,应该都为0)
                uint32                Width;                                // 地图实际的宽度
                uint32                Height;                                // 地图实际的高度
                uint16                SubWidth;                        // 小地图的宽度(默认：400px)
                uint16                SubHeight;                        // 小地图的高度(默认：320px)
                uint32                UnitIndexNum;                // 单元引索的数量
        };

        // 地图的单元头
        class UnitHeader
        {
        public:
                uint32                Flag;                // 单元标志
                uint32                Size;                // 单元大小
        };

        // 地图的数据
        class MapData
        {
        public:
                uint32                Size;                // 数据大小
                uint8                *Data;                // 数据内容
        };

        // 读取游戏地图类
        class ReadGameMap
        {
        // 公有
        public:
                ReadGameMap(void);
                ~ReadGameMap(void);

                bool LoadMap(string filename);                                        // 加载地图文件
                uint32 GetMapWidth();                                                        // 获得地图的宽度
                uint32 GetMapHeight();                                                        // 获得地图的高度
                uint32 GetSubMapWidth();                                                // 获得子地图的宽度(大话3为400px，其他为320px)
                uint32 GetSubMapHeight();                                                // 获得子地图的高度(大话3为300px，其他为240px)
                uint32 GetPointWidth();                                                        // 获得坐标的宽度(默认为20px)
                uint32 GetPointHeight();                                                // 获得坐标的高度(默认为20px)
                uint32 GetSubMapTotal();                                                // 获得子地图的总数
                uint32 GetMaskTotal();                                                        // 获得子地图中Mask的总数
                uint32 GetMapSize();                                                        // 获得地图文件的大小(字节)
                uint32 GetMapType();                                                        // 获得地图文件的类型(1为旧的，2为新的，3为大话3内测版，4为大话3正式版，5为大话3ROL文件)
                uint32 GetSubMapRowNum();                                                // 获得地图的行数
                uint32 GetSubMapColNum();                                                // 获得地图的列数

                bool ReadUnit(uint32 UnitNum);                                        // 读取地图的单元数据
                bool ReleaseUnit();                                                                // 释放地图单元的内存空间(每调用ReadUnit()都要释放)

                MapData GetJpghData();                                                        // 获得JPGH的数据
                MapData GetHeadData();                                                        // 获得HEAD的数据
                MapData GetImagData();                                                        // 获得IMAG的数据
                MapData GetJpegData();                                                        // 获得JPEG的数据
                MapData GetMaskData(uint8 ID);                                        // 获得MASK的数据
                MapData GetBlokData();                                                        // 获得BLOK的数据
                MapData GetCellData();                                                        // 获得CELL的数据
                MapData GetBrigData();                                                        // 获得BRIG的数据
                MapData GetRol0Data();                                                        // 获得ROL0的数据(只应用于大话3)
                MapData GetLigtData();                                                        // 获得LIGT的数据(只应用于大话3)

        // 私有
        private:

                bool m_isJpgh;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isHead;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isImag;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isJpeg;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isMask;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isBlok;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isCell;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isBrig;                                                                        // 是否有此数据，则可释放此内存空间
                bool m_isLigt;                                                                        // 是否有此数据，则可释放此内存空间

                bool ReadJPGH(ifstream &amp;file);                                                                        // 读取地图JPGH的数据(只应用旧的)
                bool ReadHEAD(ifstream &amp;file);                                                                        // 读取地图HEAD的数据(只应用新的)
                bool ReadIMAG(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图IMAG的数据(只应用旧的)
                bool ReadJPEG(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图JPEG的数据
                bool ReadMASK(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图MASK的数据(只应用旧的)
                bool ReadBLOK(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图BLOK的数据(只应用旧的)
                bool ReadCELL(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图CELL的数据
                bool ReadBRIG(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图BRIG的数据

                bool ReadROLO(ifstream &amp;file, uint32 Size);                                                // 读取ROLO单元数据(只应用于大话3)
                bool ReadLIGT(ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图LIGT的数据(只应用于大话3)
                bool ReadEND (ifstream &amp;file, uint32 Flag, uint32 Size);                // 读取地图END 的数据(只应用于大话3)

                uint32 m_FileFlag;                                                                // 文件标志
                string m_FileName;                                                                // 地图的文件名
                uint32 m_FileType;                                                                // 地图文件类型(1为旧的，2为新的，3为大话3内测版，4为大话3正式版，5为大话3ROL文件)

                float m_MapWidth;                                                                // 地图的宽度
                float m_MapHeight;                                                                // 地图的高度
                float m_SubMapWidth;                                                        // 子地图的宽度
                float m_SubMapHeight;                                                        // 子地图的高度
                uint32 m_PointWidth;                                                        // 坐标的宽度
                uint32 m_PointHeight;                                                        // 坐标的高度
                uint32 m_SubMapRowNum;                                                        // 子地图的行数量
                uint32 m_SubMapColNum;                                                        // 子地图的列数量
                uint32 m_SubMapTotal;                                                        // 子地图的总数
                uint32 m_MapSize;                                                                // 地图的大小

                uint32 m_Reserved;                                                                // 保留
                uint32 m_UnitIndexOffset;                                                // 单元的引索位置
                uint32 m_UnitIndexNum;                                                        // 单元的引索数量
                uint32 m_IndexOffset;                                                        // 引索位置(未知部分)
                uint32 m_IndexNum;                                                                // 引索数量(未知部分)

                uint32 *m_UnitOffsetList;                                                // 单元的偏移列表
                uint32 *m_OffsetList;                                                        // 未知部分的偏移列表

                uint32 m_MaskNum;                                                                // MASK 的数量
                uint32 m_MaskTemp;                                                                // MASK 临时变量
                uint32 *m_MaskList;                                                                // MASK 的列表

                MapData m_jpgh;                                                                        // JPGH 数据
                MapData m_head;                                                                        // HEAD 数据
                MapData m_imag;                                                                        // IMAG 数据
                MapData m_jpeg;                                                                        // JPEG 数据
                MapData m_mask[128];                                                        // MASK 数据
                MapData m_blok;                                                                        // BLOK 数据
                MapData m_cell;                                                                        // CELL 数据
                MapData m_brig;                                                                        // BRIG 数据
                MapData m_rol0;                                                                        // ROL0 数据
                MapData m_ligt;                                                                        // LIGT 数据

                UnitHeader m_ErrorUnit;                                                        // 错误单元的标志
        };
}

/************************************************************************
=======================MAP HEAD===============================
4字节 XPAM(MAPX)
4字节 地图的宽度
4字节 地图的高度

4*n字节 地图单元的引索 n=地图的宽度/640*2 * 地图高度/480*2
4字节 多出的一个地图单元引索，即结束引索，也就是文件的大小。

4字节 HGPJ (JPGH)
4字节 JPG头的大小
n字节 数据内容 n=JPG头的大小，不包括前面8字节。

==============================================================

4字节 地图单元引索的开始位置，也是KSAM的数量。

4字节 GAMI (IMAG)
4字节 大小(153600)，正好是320x240x2。
n字节 数据，不包括前面8字节。

4字节 GEPJ (JPEG)
4字节 JPEG单元大小，不包括这8字节。
2字节 单元地图的宽度
2字节 单元地图的高度
n字节 地图数据

4字节 KSAM (MASK)
4字节 大小(不定)
n字节 数据，不包括前面8字节。
:
4字节 KSAM (MASK)
4字节 大小(不定)
n字节 数据，不包括前面8字节。


4字节 KOLB (BLOK)
4字节 大小(9600)
n字节 数据，不包括前面8字节。

4字节 LLEC (CELL)
4字节 大小(192)
n字节 数据，不包括前面8字节。

4字节 GIRB (BRIG)
4字节 大小(不定)
n字节 数据，不包括前面8字节。

8字节 结束单元。

==============================================================

XPAM (MAPX) 地图文件头
Index       图象单元引索
HGPJ (JPGH) 图象JPEG Head

GAMI (IMAG) 只有1028.map地图含有这个单元。
GEPJ (JPEG) 图象数据
KSAM (MASK)
:
KSAM (MASK)
KOLB (BLOK) 遮掩规则，一比特代表一个地图像素。
LLEC (CELL) 地图规则，一字节代表一个游戏坐标。
GIRB (BRIG) 光亮规则
:
:
:
GAMI (IMAG) 只有1028.map地图含有这个单元。
GEPJ (JPEG) 图象数据
KSAM (MASK)
:
KSAM (MASK)
KOLB (BLOK) 遮掩规则，一比特代表一个地图像素。
LLEC (CELL) 地图规则，一字节代表一个游戏坐标。
GIRB (BRIG) 光亮规则
************************************************************************/

/************************************************************************
Map File New Format
Dali Wang &lt;wdl@sina.com&gt;
2004-05-09 起稿 @Changchun
2006-02-16 整理 @Haikou
2006-02-20 整理 @Haikou

======================= MAP HEAD =============================
4字节 0.1M (M1.0) 0x302E314D
4字节 地图的宽度
4字节 地图的高度

4*n字节  地图单元的引索 n=地图的宽度/640*2 * 地图高度/480*2

4字节 文件头大小，包括这4字节，及以上的字节。
==============================================================

======================= Unknown ==============================
n字节 未知用途，大小为：第一个单元引索值减去文件头大小。
注意：这个格式中还没有发现旧格式中的KOLB、GAMI和KSAM。
有可能和这些单元的用途相同。
==============================================================

======================= Unit Data ============================
4字节 地图单元引索的开始位置。
n*4字节 n为上面的值，n为0时不存在。

4字节 GEPJ (JPEG)
4字节 大小
n字节 数据

4字节 LLEC (CELL)
4字节 大小
n字节 数据

4字节 BRIG (GIRB)
4字节 大小
n字节 数据

4字节 结束单元。
==============================================================

0.1M                新地图文件头        
Index                数据块引索

Unknown         n字节，未知用途(暂称为HEAD)

GEPJ(JPEG)        图象数据
LLEC(CELL)        地图规则，一字节代表一个游戏坐标
GIRB(BRIG)        光亮规则
:
:
:
GEPJ(JPEG)        图象数据
LLEC(CELL)        地图规则，一字节代表一个游戏坐标
GIRB(BRIG)        光亮规则

************************************************************************/

/************************************************************************
大话西游3的MAP格式
Dali Wang &lt;wdl@sina.com&gt;
2007-05-18

=========== MAP HEAD ============
4字节 文件标志 0.3M (M3.0) 0x524F4C30
4字节 保留(未知作用,应该都为0)
4字节 地图实际的宽度
4字节 地图实际的高度
2字节 坐标的宽度(默认：20px)
2字节 坐标的高度(默认：20px)
2字节 小地图的宽度(默认：400px)
2字节 小地图的高度(默认：320px)
4字节 单元引索的位置
4字节 单元引索的数量
4字节 引索的位置(未知部分)
4字节 引索的数量(未知部分)

=========== UNIT INDEX =========
4字节*n 单元的引索       

========== 未知数据 ============
可能是地图遮掩关系等数据

========== UNIT DATA ===========
4字节 MASK(KSAM) 遮掩关系
4字节 大小
n字节 数据

4字节 JPEG(GEPJ) JPEG 图片数据
4字节 大小
n字节 数据

4字节 CELL(LLEC) 地图行走规则
4字节 大小
n字节 数据

4字节 LIGT(TGIL) 地图亮度规则
4字节 大小
n字节 数据

4字节 END ( DNE) 单元结束标志
4字节 大小

////////////////////////////////
HEADER 40字节

INDEX
......
INDEX

未知数据

MASK (KSAM) 0x4D41534B
MSK2 (2KSM) 0x4D534B32
JPEG (GEPJ) 0x4A504547
CELL (LLEC) 0x43454C4C
LIGT (TGIL) 0x4C494754
END  ( DNE) 0x454E4420
:
:
:
MASK (KSAM) 0x4D41534B
MSK2 (2KSM) 0x4D534B32
JPEG (GEPJ) 0x4A504547
CELL (LLEC) 0x43454C4C
LIGT (TGIL) 0x4C494754
END  ( DNE) 0x454E4420
************************************************************************/

/************************************************************************
大话3地图 ROL 文件格式
Dali Wang&lt;wdl@sina.com&gt;
2007-05-18

=========== FILE HEAD ==========
24字节
4字节 文件标志 0LOR(ROL0)
4字节 保留 (00 00 00 00)
4字节 大地图的宽度
4字节 大地图的高度
2字节 小地图的宽度
2字节 小地图的高度
4字节 引索的数量

=========== JPEG INDEX =========
n*4字节 引索列表

=========== JPEG DATA ==========
4字节 47 45 50 4A 标志 GEPJ(JPEG)
4字节 B7 20 00 00 数据大小
n字节 数据
:
:
:
4字节 47 45 50 4A 标志 GEPJ(JPEG)
4字节 数据大小
n字节 数据

************************************************************************/


#include <"ReadGameMap.h">;

using namespace NetEase; // 使用NetEase命名空间

ReadGameMap::ReadGameMap(void)
{
        m_MapWidth = 0;                                                                // 地图的宽度
        m_MapHeight = 0;                                                        // 地图的高度
        m_SubMapWidth = 0;                                                        // 子地图的宽度
        m_SubMapHeight = 0;                                                        // 子地图的高度
        m_PointWidth = 0;                                                        // 坐标的宽度
        m_PointHeight = 0;                                                        // 坐标的高度
        m_SubMapRowNum = 0;                                                        // 子地图的行数量
        m_SubMapColNum = 0;                                                        // 子地图的列数量
        m_SubMapTotal = 0;                                                        // 子地图的总数
        m_MapSize = 0;                                                                // 地图的大小

        m_Reserved = 0;                                                                // 保留
        m_UnitIndexOffset = 0;                                                // 单元的引索位置
        m_UnitIndexNum = 0;                                                        // 单元的引索数量
        m_IndexOffset = 0;                                                        // 引索位置(未知部分)
        m_IndexNum = 0;                                                                // 引索数量(未知部分)

        m_MaskNum = 0;                                                                // MASK 的数量
        m_MaskTemp = 0;                                                                // MASK 临时变量

        m_isJpgh = false;
        m_isHead = false;
        m_isImag = false;
        m_isJpeg = false;
        m_isMask = false;
        m_isBlok = false;
        m_isCell = false;
        m_isBrig = false;
        m_isLigt = false;

}

ReadGameMap::~ReadGameMap(void)
{
        if (m_isJpgh)
        {
                delete[] m_jpgh.Data;
        }

        if (m_isHead)
        {
                delete[] m_head.Data;
        }

}

// 加载地图文件
bool ReadGameMap::LoadMap(string filename)
{
        m_FileName = filename;
        ifstream infile;

        // 打开地图文件
        infile.open(filename.c_str(), ios::in|ios::binary);

        // 判断文件是否存在
        if(!infile)
        {
                cerr &lt;&lt; &quot;不能打开地图文件 :&quot; &lt;&lt; filename &lt;&lt; endl;
                exit(EXIT_FAILURE); // 退出
        }

        uint32 TempFlag; // 临时文件标志
        infile.read((char*)&amp;TempFlag,sizeof(uint32));
        infile.seekg(0, ios_base::beg); // 跳到文件开头位置

        // 文件标志
        // 0x4D415058 (MAPX) 大话2旧地图
        // 0x4D312E30 (M1.0) 大话2新地图 梦幻地图
        // 0x4D322E35 (M2.5) 大话3内测版
        // 0x4D332E30 (M3.0) 大话3正式版
        // 0x524F4C30 (ROL0) 大话3地图背景文件
        if ((TempFlag == 0x4D415058) | (TempFlag == 0x4D312E30) | (TempFlag == 0x4D322E35) | (TempFlag == 0x4D332E30) | (TempFlag == 0x524F4C30))
        {
                switch(TempFlag)
                {
                case 0x4D415058:
                        m_FileType = 1; // 大话2旧地图格式
                        break;
                case 0x4D312E30:
                        m_FileType = 2; // 大话2新地图、梦幻地图格式
                        break;
                case 0x4D322E35:
                        m_FileType = 3; // 大话3内测版地图格式
                        break;
                case 0x4D332E30:
                        m_FileType = 4; // 大话3正式版地图格式
                        break;
                case 0x524F4C30:
                        m_FileType = 5; // 大话3地图背景文件格式
                        break;
                }

                if ((m_FileType == 1) | (m_FileType == 2))
                {
                        MapHeader1 header;
                        infile.read((char*)&amp;header,sizeof(MapHeader1));
                        m_FileFlag=header.Flag;                // 文件标志
                        m_MapWidth = (float)header.Width;        // 地图的宽度
                        m_MapHeight= (float)header.Height;        // 地图的高度

                        m_SubMapWidth = 320;// 子地图的宽度
                        m_SubMapHeight = 240;// 子地图的高度
                        m_PointWidth = 20;// 坐标的宽度
                        m_PointHeight = 20;// 坐标的高度
                }

                if ((m_FileType == 3) | (m_FileType == 4))
                {
                        MapHeader3 header;
                        infile.read((char*)&amp;header,sizeof(MapHeader3));
                        m_FileFlag=header.Flag;                                                // 文件标志
                        m_MapWidth = (float)header.Width;                        // 地图的宽度
                        m_MapHeight= (float)header.Height;                        // 地图的高度
                        m_SubMapWidth = header.SubWidth;                        // 子地图的宽度
                        m_SubMapHeight = header.SubHeight;                        // 子地图的高度
                        m_PointWidth = header.PointWidth;                        // 坐标的宽度
                        m_PointHeight = header.PointHeight;                        // 坐标的高度

                        m_Reserved=header.Reserved;                                        // 保留
                        m_UnitIndexOffset=header.UnitIndexOffset;        // 单元的引索位置
                        m_UnitIndexNum=header.UnitIndexNum;                        // 单元的引索数量
                        m_IndexOffset=header.IndexOffset;                        // 引索位置(未知部分)
                        m_IndexNum=header.IndexNum;                                        // 引索数量(未知部分)
                }

                if (m_FileType == 5)
                {
                        Rol0Header header;
                        infile.read((char*)&amp;header,sizeof(Rol0Header));
                        m_FileFlag=header.Flag;                                                // 文件标志
                        m_Reserved=header.Reserved;                                        // 保留
                        m_MapWidth = (float)header.Width;                        // 地图的宽度
                        m_MapHeight= (float)header.Height;                        // 地图的高度
                        m_SubMapWidth = header.SubWidth;                        // 子地图的宽度
                        m_SubMapHeight = header.SubHeight;                        // 子地图的高度
                        m_UnitIndexNum=header.UnitIndexNum;                        // 单元的引索数量
                }

                // 注：因为有些地图的尺寸并一定可以被小地图尺寸整除，所以需要趋向最大取整
                m_SubMapRowNum=(uint32)ceil((float)(m_MapHeight/m_SubMapHeight)); // 计算行中子地图的数量
                m_SubMapColNum=(uint32)ceil((float)(m_MapWidth/m_SubMapWidth)); // 计算列中子地图的数量
                m_SubMapTotal=m_SubMapRowNum*m_SubMapColNum; // 计算地图中总的子地图数量

                // 读取单元偏移值列表
                m_UnitOffsetList=new uint32[m_SubMapTotal]; // 自动分配列表空间
                infile.read((char*)m_UnitOffsetList, sizeof(uint32) * m_SubMapTotal); // 读取列表

                // 仅大话3地图使用
                if ((m_FileType == 3) | (m_FileType == 4))
                {
                        // 读取未知部分偏移值列表
                        m_OffsetList=new uint32[m_IndexNum]; // 分配(未知部分)的列表空间
                        infile.read((char*)&amp;m_OffsetList, sizeof(uint32) * m_IndexNum); // 读取列表(未知部分)
                }
        }
        else
        {
                cerr &lt;&lt; filename &lt;&lt; &quot;: 地图文件格式错误!&quot; &lt;&lt; endl;
                exit(EXIT_FAILURE); // 退出
        }

        if (m_FileType == 1)
        {
                infile.read((char*)&amp;m_MapSize,sizeof(uint32)); // 获得地图文件的大小
                ReadJPGH(infile); // 读取JPGH的数据
        }

        if ((m_FileType == 2) | (m_FileType == 3) | (m_FileType == 4))
        {
                ReadHEAD(infile); // 读取新地图的数据
        }

        if (m_FileType == 5)
        {
                // 此格式无需处理
        }
        infile.close();
        return true;
}


// 读取旧地图JPGH的数据
bool ReadGameMap::ReadJPGH(ifstream &amp;file)
{        
        m_isJpgh = true;
        UnitHeader JpegHead;
        file.read((char*)&amp;JpegHead,sizeof(JpegHead)); // 读取单元头的数据

        // 判断标志是否正确(HGPJ)
        if (JpegHead.Flag!=0x4A504748)
        {
                cerr &lt;&lt; &quot;JPEG HEADER 标志错误!&quot; &lt;&lt; endl;
                m_isJpgh = false;
                return false;
        }
        m_jpgh.Data = new uint8[JpegHead.Size]; // 分配单元数据的内存空间
        m_jpgh.Size=JpegHead.Size;
        file.read((char*)&amp;m_jpgh.Data,JpegHead.Size); // 读取单元数据
        return true;
}

// 读取新地图HEAD的数据
bool ReadGameMap::ReadHEAD(ifstream &amp;file)
{        
        m_isHead = true;
        uint32 HeaderSize;

        if (m_FileType == 2)
        {
                file.read((char*)&amp;m_MapSize,sizeof(uint32)); // 获得文件头的大小
                file.read((char*)&amp;HeaderSize,sizeof(uint32)); // 获得HEAD的大小
        }

        if ((m_FileType == 3) | (m_FileType == 4))
        {
                HeaderSize=m_UnitIndexOffset-m_IndexOffset; // 计算地图头数据的大小
        }
        m_head.Size=HeaderSize;
        m_head.Data = new uint8[HeaderSize];
        file.read((char*)m_head.Data,HeaderSize); // 读取地图头数据
        return true;
}

// 读取地图的单元数据
bool ReadGameMap::ReadUnit(uint32 UnitNum)
{
        ifstream file;
        uint32 seek;                // 跳转地址
        bool Result;                // 结果
        bool loop=true;                // 是否循环
        m_MaskTemp=1;

        m_isMask=false;
        m_isJpeg=false;
        m_isCell=false;
        m_isLigt=false;

        // 打开文件流 
        file.open(m_FileName.c_str(), ios::in|ios::binary);
        if(!file)
        {
                cerr &lt;&lt; &quot;不能打开地图文件 :&quot; &lt;&lt; m_FileName &lt;&lt; endl;
                return false;
        }

        seek=m_UnitOffsetList[UnitNum];
        file.seekg(seek,ios_base::beg); // 跳转到单元开始的位置

        if ((m_FileType == 1) | (m_FileType == 2))
        {
                file.read((char*)&amp;m_MaskNum,sizeof(uint32)); // 获得MASK的数量
        }

        if ((m_FileType == 2) &amp;&amp; (m_MaskNum &gt; 0))
        {
                m_MaskList = new uint32[m_MaskNum];
                file.read((char*)m_MaskList,sizeof(uint32)*m_MaskNum);
        }

        UnitHeader unit;

        while(loop)
        {
                file.read((char*)&amp;unit,sizeof(UnitHeader)); // 读取单元的头数据

                switch(unit.Flag)
                {

                        // GAMI &quot;47 41 4D 49&quot;
                case 0x494D4147:
                        Result=ReadIMAG(file,unit.Flag,unit.Size);
                        break;

                        // 2KSM &quot;32 4B 53 4D&quot;
                case 0x4D534B32:
                        Result=ReadMASK(file,unit.Flag,unit.Size);
                        break;
                        // KSAM &quot;4B 53 41 4D&quot;
                case 0x4D41534B:
                        Result=ReadMASK(file,unit.Flag,unit.Size);
                        break;

                        // GEPJ &quot;47 45 50 4A&quot;
                case 0x4A504547:
                        Result=ReadJPEG(file,unit.Flag,unit.Size);

                        if (m_FileFlag==0x524F4C30) // 是否为ROL文件
                        {
                                loop=false;
                        }

                        break;

                        // KOLB &quot;4B 4F 4C 42&quot;
                case 0x424C4F4B:
                        Result=ReadBLOK(file,unit.Flag,unit.Size);
                        break;

                        // LLEC &quot;4C 4C 45 43&quot;
                case 0x43454C4C:
                        Result=ReadCELL(file,unit.Flag,unit.Size);
                        break;

                        // GIRB &quot;47 49 52 42&quot;
                case 0x42524947:
                        Result=ReadBRIG(file,unit.Flag,unit.Size);
                        break;

                        // TGIL &quot;54 47 49 4C&quot;
                case 0x4C494754:
                        Result=ReadLIGT(file,unit.Flag,unit.Size);
                        break;

                        //  DNE &quot;20 44 4E 45&quot;
                case 0x454E4420:
                        Result=ReadEND(file,unit.Flag,unit.Size);
                        loop=false;
                        break;

                        // 默认处理
                default:
                        // 错误标志
                        m_ErrorUnit.Flag=unit.Flag;
                        m_ErrorUnit.Size=unit.Size;
                        loop=false;
                        break;
                }
        }
        file.close();
        return Result;
}

// 释放地图单元的内存空间
bool ReadGameMap::ReleaseUnit()
{
        if (m_isImag)
        {
                delete[] m_imag.Data;
        }

        if (m_isJpeg)
        {
                delete[] m_jpeg.Data; // 释放JPEG的内存空间
        }

        if (m_isBlok)
        {
                delete[] m_blok.Data;
        }

        if (m_isCell)
        {
                delete[] m_cell.Data; // 释放CELL的内存空间
        }

        if (m_isBrig)
        {
                delete[] m_brig.Data;
        }

        if (m_isLigt)
        {
                delete[] m_ligt.Data; // 释放LIGT的内存空间
        }
        
        if (m_FileType == 1)
        {
                if (m_isMask)
                {
                        //delete m_mask[0].Data;
                }
        }

        if (m_FileType == 2)
        {
                delete[] m_MaskList;
        }

        if ((m_FileType == 3) | (m_FileType == 4))
        {
                if (m_isMask)
                {
                        //delete[] m_mask[m_MaskTemp].Data;
                }
        }

                
        return true;
}

// 获得地图宽度
uint32 ReadGameMap::GetMapWidth()
{
        return (uint32)m_MapWidth;
}

// 获得地图高度
uint32 ReadGameMap::GetMapHeight()
{
        return (uint32)m_MapHeight;
}

// 获得子地图的宽度
uint32 ReadGameMap::GetSubMapWidth()
{
        return (uint32)m_SubMapWidth;
}

// 获得子地图的高度
uint32 ReadGameMap::GetSubMapHeight()
{
        return (uint32)m_SubMapHeight;
}

// 获得坐标的宽度
uint32 ReadGameMap::GetPointWidth()
{
        return m_PointWidth;
}

// 获得坐标的高度
uint32 ReadGameMap::GetPointHeight()
{
        return m_PointHeight;
}

// 获得地图的行数
uint32 ReadGameMap::GetSubMapRowNum()
{
        return m_SubMapRowNum;
}

// 获得地图的列数
uint32 ReadGameMap::GetSubMapColNum()
{
        return m_SubMapColNum;
}

// 获得子地图的总数量
uint32 ReadGameMap::GetSubMapTotal()
{
        return m_SubMapTotal;
}

// 获得子地图中Mask的总数
uint32 ReadGameMap::GetMaskTotal()
{
        return m_MaskNum;
}

// 获得地图的大小
uint32 ReadGameMap::GetMapSize()
{
        return m_MapSize;
}

// 获得地图的类型
uint32 ReadGameMap::GetMapType()
{
        return m_FileType;
}

// 读取ROL0单元数据
bool ReadGameMap::ReadROLO(ifstream &amp;file, uint32 Size)
{
        if (m_FileFlag==0x524F4C30) // 是否为ROL文件
        {
                m_isJpeg = true;
                m_jpeg.Data = new uint8[Size]; // 分配单元数据的内存空间
                file.read((char*)m_jpeg.Data,Size); // 读取单元JPEG的数据
                m_jpeg.Size = Size;
        }
        else
        {
                cerr &lt;&lt; &quot;ROL0标志错误!&quot; &lt;&lt; endl;
                m_isJpeg = false;
                return false;
        }
        return true;
}

// 读取地图IMAG的数据
bool ReadGameMap::ReadIMAG(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag==0x494D4147)
        {
                m_isImag = true;
                m_imag.Data = new uint8[Size]; // 分配单元数据的内存空间
                file.read((char*)m_imag.Data,Size); // 读取单元IMAG的数据
                m_imag.Size = Size;
        }
        else
        {
                cerr &lt;&lt; &quot;IMAG标志错误!&quot; &lt;&lt; endl;
                m_isImag = false;
                return false;
        }
        return true;
}

// 读取地图MASK的数据
bool ReadGameMap::ReadMASK(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        // 这个处理可能存在问题
        if (Flag==0x4D41534B || Flag==0x4D534B32)
        {
                m_isMask = true;
                if (m_FileType == 1)
                {
                        m_mask[0].Data = new uint8[Size];
                        file.read((char*)m_mask[0].Data,Size);
                        m_mask[0].Size = Size;
                }

                if ((m_FileType == 3) | (m_FileType == 4))
                {
                        m_MaskNum = Size; // Mask的数量
                        m_mask[m_MaskTemp].Data = new uint8[Size]; // 分配单元数据的内存空间
                        for (uint32 i=0; i&lt; Size; i++)
                        {
                                file.read((char*)m_mask[m_MaskTemp].Data,4);
                        }
                }
        }
        else
        {
                cerr &lt;&lt; &quot;MASK标志错误!&quot; &lt;&lt; endl;
                m_isMask = false;
                return false;
        }
        return true;
}

// 读取地图JPEG的数据
bool ReadGameMap::ReadJPEG(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag==0x4A504547)
        {
                m_isJpeg = true;
                m_jpeg.Data = new uint8[Size]; // 分配单元数据的内存空间
                file.read((char*)m_jpeg.Data,Size); // 读取单元JPEG的数据
                m_jpeg.Size=Size;
        }
        else
        {
                cerr &lt;&lt; &quot;JPEG标志错误!&quot; &lt;&lt; endl;
                m_isJpeg = false;
                return false;
        }
        return true;
}

// 读取地图BLOK的数据
bool ReadGameMap::ReadBLOK(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag == 0x424C4F4B)
        {
                m_isBlok = true;
                m_blok.Data = new uint8[Size]; // 分配单元数据的内存空间
                file.read((char*)m_blok.Data,Size); // 读取单元BLOK的数据
                m_blok.Size = Size;
        }
        else
        {
                cerr &lt;&lt; &quot;BLOK标志错误!&quot; &lt;&lt; endl;
                m_isBlok = false;
                return false;

        }
        return true;
}

// 读取地图CELL的数据
bool ReadGameMap::ReadCELL(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag==0x43454C4C)
        {
                m_isCell = true;
                m_cell.Data = new uint8[Size]; // 分配单元数据的内存空间
                file.read((char*)m_cell.Data,Size); // 读取单元CELL的数据
                m_cell.Size=Size;
        }
        else
        {
                cerr &lt;&lt; &quot;CELL标志错误!&quot; &lt;&lt; endl;
                m_isCell = false;
                return false;
        }
        return true;
}

// 读取地图BRIG的数据
bool ReadGameMap::ReadBRIG(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag == 0x42524947)
        {
                m_isBrig = true;
                m_brig.Data = new uint8[Size];
                file.read((char*)m_brig.Data,Size); // 分配单元数据的内存空间
                m_brig.Size;
        }
        else
        {
                cerr &lt;&lt; &quot;BRIG标志错误!&quot; &lt;&lt; endl;
                m_isBrig = false;
                return false;
        }
        return true;
}

// 读取地图LIGT的数据
bool ReadGameMap::ReadLIGT(ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag==0x4C494754)
        {
                m_isLigt = true;
                m_ligt.Data = new uint8[Size]; // 分配单元数据的内存空间
                file.read((char*)m_ligt.Data,Size); // 读取单元JPEG的数据
                m_ligt.Size=Size;
        }
        else
        {
                cerr &lt;&lt; &quot;LIGT标志错误!&quot; &lt;&lt; endl;
                m_isLigt = false;
                return false;
        }
        return true;
}

// 读取地图END 的数据
bool ReadGameMap::ReadEND (ifstream &amp;file, uint32 Flag, uint32 Size)
{
        if (Flag==0x454E4420)
        {
                // 不需要处理数据
        }
        else
        {
                cerr &lt;&lt; &quot;END 标志错误!&quot; &lt;&lt; endl;
                return false;
        }
        return true;
}

// 获得JPGH的数据
MapData ReadGameMap::GetJpghData()
{
        return m_jpgh;
}

// 获得HEAD的数据
MapData ReadGameMap::GetHeadData()
{
        return m_head;
}

// 获得IMAG的数据
MapData ReadGameMap::GetImagData()
{
        return m_imag;
}

// 获得JPEG的数据
MapData ReadGameMap::GetJpegData()
{
        return m_jpeg;
}


// 获得MASK的数据
MapData ReadGameMap::GetMaskData(uint8 ID)
{
        return m_mask[ID];
}

// 获得BLOK的数据
MapData ReadGameMap::GetBlokData()
{
        return m_blok;
}

// 获得CELL的数据
MapData ReadGameMap::GetCellData()
{
        return m_cell;
}

// 获得BRIG的数据
MapData ReadGameMap::GetBrigData()
{
        return m_brig;
}

// 获得LIGT的数据
MapData ReadGameMap::GetLigtData()
{
        return m_ligt;
}
