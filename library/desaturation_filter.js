Phaser.Filter.Desaturation = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "varying lowp vec4 vColor;",
        "void main() {",
            "gl_FragColor = vec4(vColor.r, vColor.g, vColor.b, 1.0);",
        "}"
    ];

};

Phaser.Filter.Desaturation.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Desaturation.prototype.constructor = Phaser.Filter.Desaturation;

Phaser.Filter.Desaturation.prototype.init = function (width, height) {
    this.setResolution(width, height);
}
