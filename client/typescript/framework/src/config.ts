

export default class Config {
    static readonly isBinary:boolean = false;
    static readonly isDevelop:boolean = true;
    static readonly gatwayAdd:string = 'http://www.babaliuliu.com:8891/';
    static readonly cdn_root:string = 'http://test149.babaliuliu.com:8891/';
    static readonly Scenes:any={
        loginScene:{name:'loginScene',bgMusic:'',preloads:[]},
        hallScene:{name:'hallScene',bgMusic:'',preloads:['framework/hall']},
        gameScene:{name:'gameScene',bgMusic:'',preloads:[]}
    };
};
