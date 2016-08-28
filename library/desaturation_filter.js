Phaser.Filter.Desaturation = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "varying mediump vec2 vTextureCoord;",
        "uniform sampler2D uSampler;",

        "void main() {",
            "gl_FragColor = texture2D(uSampler, vTextureCoord);",
            "mediump float f = 0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b;",
            "gl_FragColor.rgb = vec3(f, f, f);",
        "}"
    ];

};

Phaser.Filter.Desaturation.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Desaturation.prototype.constructor = Phaser.Filter.Desaturation;

Phaser.Filter.Desaturation.prototype.init = function (width, height) {
    this.setResolution(width, height);
}
