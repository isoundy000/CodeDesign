import { Util } from "../../tools/utils";

//const CryptoJS:any = require('./aes');

const STR_KEY:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const AES_KEY:string = '10231234545613465926778834590126';
const AES_IV:string = '3101238945674526';
class CDES{
    private static _instance:CDES = null;
    public static getInstance():CDES{
        if (CDES._instance === null)
            CDES._instance = new CDES();

        return CDES._instance;
    };
    // 解码
    public decodeCBC(data:string):string{
        if (Util.isInvalid(data) || Util.isEmptyStr(data)) return '';/*
        let _key = CryptoJS.enc.Utf8.parse(AES_KEY);
        let _iv = CryptoJS.enc.Utf8.parse(AES_IV);
        let _result = CryptoJS.AES.decrypt(data,_key, {iv:_iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7});
        return _result.toString(CryptoJS.enc.Utf8);*/
        return '';
    };

    // 编码
    public encodeCBC(data:string|Object):string{
        //把生成的加密对象转换为字符串
        if (Util.isInvalid(data)) return '';
        let str:string = typeof data === 'object' ? JSON.stringify(data):data;
        if (Util.isEmptyStr(str)) return '';/*
        let _key = CryptoJS.enc.Utf8.parse(AES_KEY);
        let _iv = CryptoJS.enc.Utf8.parse(AES_IV);
        let _obj = CryptoJS.AES.encrypt(str,_key, {iv:_iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7});
        return this.decodeBase64(_obj.ciphertext.toString(CryptoJS.enc.Base64));*/
        return '';
    };

    unescapeString(str:string):string{
        return unescape(this.decodeBase64(str));
    };
    escapeString(str:string):string{
        return this.encodeBase64(escape(str));
    }

    public decodeBase64(str:string):string{
        let output = '';
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while(i < str.length) {
            enc1 = STR_KEY.indexOf(str.charAt(i++));
            enc2 = STR_KEY.indexOf(str.charAt(i++));
            enc3 = STR_KEY.indexOf(str.charAt(i++));
            enc4 = STR_KEY.indexOf(str.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if(enc3 !== 64) output = output + String.fromCharCode(chr2);
            if(enc4 !== 64) output = output + String.fromCharCode(chr3);
        }
        return this.decodeUTF8(output);
    }

    public encodeBase64(str:string):string {
        let output = '';
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        str = this.encodeUTF8(str);
        while(i < str.length) {
            chr1 = str.charCodeAt(i++);
            chr2 = str.charCodeAt(i++);
            chr3 = str.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            isNaN(chr2)?(enc3 = enc4 = 64): (isNaN(chr3) && (enc4 = 64));
            output += (STR_KEY.charAt(enc1) + STR_KEY.charAt(enc2) + STR_KEY.charAt(enc3) + STR_KEY.charAt(enc4));
        }
        return output;
    };

    public encodeUTF8(str:string):string{
        str = str.replace(/\r\n/g, '\n');
        let utftext = '';
        for(let n = 0; n < str.length; n++) {
            let c = str.charCodeAt(n);
            if (c < 128)
                utftext += String.fromCharCode(c);
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    }

    public decodeUTF8(str:string):string{
        let _str = '';
        let i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        while (i < str.length) {
            c = str.charCodeAt(i);
            if (c < 128) {
                _str += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = str.charCodeAt(i + 1);
                _str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = str.charCodeAt(i + 1);
                c3 = str.charCodeAt(i + 2);
                _str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return _str;
    }
};

export const DES:CDES = CDES.getInstance();