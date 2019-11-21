// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        bottomCircle: cc.Node,
        lastDirection: 0,//默认方向 1-上 2下 3-左 4-右
        rotaAngle: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.rotaAngle = 0.01;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },
    onTouchMove(event) {
        let del = event.getDelta();//获取触点距离上一次事件移动的距离
        this.cameraQuat = this.bottomCircle.quat;//获取当前节点的四元数
        if (Math.abs(del.x) < Math.abs(del.y)) {
            this.lastDirectionX = del.y > 0 ? -1 : 1;//逆时针为正，顺时针为负 ,向上滑动为顺时针，向下滑动为逆时针
            this.lastDirectionY = (del.x > 0 ? 1 : -1) * Math.abs(this.lastDirectionX * del.x / del.y);//计算出方向向量y的值,与滑动距离成反比
        } else if (Math.abs(del.x) >= Math.abs(del.y)) {
            this.lastDirectionY = del.x > 0 ? 1 : -1;//向右滑动为逆时针，向左滑动为顺时针方向
            this.lastDirectionX = (del.y > 0 ? -1 : 1) * Math.abs(this.lastDirectionY * del.y / del.x);//计算此时方向向量x的值，与滑动距离成反比
        }
        //rot：节点quat
        // axis：方向向量,需归一化处理，否则物体变形。normalizeSelf()向量归一化
        // rad：角度 旋转角度
        // out：传递的变量，
        this.bottomCircle.quat = this.cameraQuat.rotateAround(this.cameraQuat, cc.v3(this.lastDirectionX, this.lastDirectionY, 0).normalizeSelf(), 0.05, new cc.Quat());
    },
    start() {

    },

    // update (dt) {},
});
