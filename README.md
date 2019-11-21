# 用cocos Creator做3D球体自转、公转，触摸旋转小球
### 具体效果   
<video id="demo" controls="" preload="none" poster="2E096A079D4A93A2A7D9EB8729D568D8.png">
	<source id="mp4" src="QQ20191121-214644-HD.mp4" type="video/mp4">
</video>

### 3D球体自转   
3D球体的自转主要是通过在每一帧修改球体节点的欧拉角实现的   

```   
   this.node.eulerAngles = this.node.eulerAngles.add(cc.v3(0, this.rotationSpeed, 0));   
```   

### 3D球体公转   

实现球体公转的思想是在每一帧根据公转半径以及周期计算并修改球体的position,从而实现球体围绕一个点做圆周运动。水平旋转，θ为下一帧的角度则球体的坐标为         
      
	x = cos(θ) * rad;   
	y = 0;   
	z = sin(θ) * rad;   
具体代码实现如下   
	
```   
	update(dt) {
        let a = dt * 2 * Math.PI / this.time;//dt为两帧之间的时间间隔，算出两帧之间需要转动的弧度
        this.currentAngle -= a;//算出具体角度，+-控制旋转方向
        this.node.position = cc.v3(Math.cos(this.currentAngle) * this.radius, 0, Math.sin(this.currentAngle) * this.radius);//计算并修改下一帧节点的坐标位置
    },
```


### 旋转3D小球

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
