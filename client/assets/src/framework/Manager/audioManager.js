// audioManager
// 音效管理
module.exports = {
    /**
     * 初始化
     */
    init(){
        this.bgMusicId = -1;      //背景音乐id
        this.bgMusicVloume = 1.0;//音量值
        this.voiceVloume = 1.0;  //音效值
        var v = cc.sys.localStorage.getItem("bgMusicVloume");
        if(v != null){
            this.bgMusicVloume = parseFloat(v);    
        }
        var v = cc.sys.localStorage.getItem("voiceVloume");
        if(v != null){
            this.voiceVloume = parseFloat(v);    
        }
    },
    /**
     * 通过url找资源
     * @param rul
     */
    getUrl:function(url){
        return cc.url.raw("resources/" + url);
    },
    /**
     * 播放url资源
     * @param rul
     */
    playBgMusic(url){
        var audioUrl = this.getUrl(url);
        if(this.bgMusicId >= 0){
            cc.audioEngine.stop(this.bgMusicId);
        }
        this.bgMusicId = cc.audioEngine.play(audioUrl,true,this.bgMusicVloume);
    },
    /**
     * 暂停背景音乐
     * @param rul
     */
    pauseBgMusic(){
        if(this.bgMusicId >= 0){
            cc.audioEngine.pause(this.bgMusicId);
        }
    },
    /**
     * 恢复背景音乐(如果是暂停状态)
     * @param rul
     */
    resumeBgMusic(){
        if(this.bgMusicId >= 0 && this.bgMusicVloume > 0 && cc.audioEngine.AudioState.PAUSED===cc.audioEngine.getState(this.bgMusicId)){
            cc.audioEngine.resume(this.bgMusicId);
        }
    },
    /**
     * 播放音效url资源
     * @param rul
     */
    playVoice(url){
        var audioUrl = this.getUrl(url);
        if(this.voiceVloume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.voiceVloume);    
        }
    },

    getVioceVloume(){
        return this.voiceVloume;
    },
    setVoiceVloume:function(v){
        if(this.voiceVloume != v){
            cc.sys.localStorage.setItem("voiceVloume",v);
            this.voiceVloume = v;
        }
    },
    getBgMusicVloume(){
        return this.bgMusicVloume;
    },
    setBgMusicVloume:function(v,force){
        if(this.bgMusicId >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgMusicId);
            }
            else{
                cc.audioEngine.pause(this.bgMusicId);
            }
        }
        if(this.bgMusicVloume != v || force){
            cc.sys.localStorage.setItem("bgMusicVloume",v);
            this.bgMusicVloume = v;
            cc.audioEngine.setVolume(this.bgMusicId,v);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
};
