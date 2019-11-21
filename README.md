# creatorDemo   
#### 用cocos Creator做3D球体自转、公转，触摸旋转小球

触摸旋转3d物体方法，通过修改物体的四元数来达到旋转物体
```   

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
  ```

 2.1.2 Quat未提供rotateAround 方法，在 /Applications/CocosCreator.app/Contents/Resources/engine/cocos2d/core/value-types/quat.js 中自己添加以下方法
```   

/**
*
*@param rot：节点quat
*@param axis：方向向量,需归一化处理，否则物体变形。normalizeSelf()向量归一化
*@param rad：角度 旋转角度
*out：传递的变量
*/
proto.rotateAround = function (rot, axis, rad, out) {
    // body...
    return quat.rotateAround(out,rot,axis,rad);
}   
```   

重新编译引擎即可调用该方法

重新编译引擎方法 http://docs.cocos.com/creator/manual/zh/advanced-topics/engine-customization.html?h=%E7%BC%96%E8%AF%91
