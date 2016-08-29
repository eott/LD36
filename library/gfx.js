GFX = function(app) {
    this.app = app
    this.menuSlide = 'start'
    this.inMenu = true
    this.menuFc = 0
}

GFX.prototype.preload = function() {
    this.app.game.load.image('menuScreen', 'assets/images/icons/menu_screen.png')
    this.app.game.load.image('clock', 'assets/images/icons/clock.png')
    this.app.game.load.script('filter', 'library/desaturation_filter.js')
}

GFX.prototype.create = function() {
    this.graphics = this.app.game.add.graphics(50, 50)
    this.graphics.fixedToCamera = true

    this.filter = this.app.game.add.filter('Desaturation', this.app.game.width, this.app.game.height)

    this.menuScreen = this.app.game.add.image(this.app.game.camera.x + 100, this.app.game.camera.y + 100, 'menuScreen')
    this.menuScreen.fixedToCamera = true

    this.menuText = this.app.game.add.text(
        150,
        150,
        '',
        {font: "18px Consolas", fill: "#00ff00", stroke: "#00ff00", strokeThickness: 1, align: "left"}
    )
    this.menuText.fixedToCamera = true
    this.showMenuSlide(this.menuSlide)

    this.healthText = this.app.game.add.text(
        115,
        45,
        '100',
        {font: "24px Consolas", fill: "#ffffff", stroke: "#ffffff", strokeThickness: 1, align: "left"}
    )
    this.healthText.fixedToCamera = true

    this.timerText = this.app.game.add.text(
        this.app.game.width - 145,
        45,
        '0',
        {font: "24px Consolas", fill: "#ffffff", stroke: "#ffffff", strokeThickness: 1, align: "center"}
    )
    this.timerText.fixedToCamera = true
    this.timerText.anchor.set(0.5, 0)

    this.timerIcon = this.app.game.add.image(this.app.game.width - 220, 52, 'clock')
    this.timerIcon.fixedToCamera = true
}

GFX.prototype.update = function() {
    if (this.inMenu) {
        this.menuFc++
    }

    if (this.inMenu && this.menuFc <= this.menuContent.length) {
        this.menuText.text = this.menuContent.substr(0, this.menuFc)
        this.app.sfx.playAudio('beep')
    } else if (this.inMenu) {
        this.app.sfx.pauseAudio('beep')
    }

    if (
        this.inMenu
        && (
            this.menuSlide == 'start'
            || this.menuSlide == 'pickup'
        )
        && this.app.cursors.y.isDown
    ) {
        this.inMenu = false
        this.menuFc = 0
        this.menuScreen.visible = false
        this.menuText.visible = false
        this.app.resume()
        this.app.player.unfreeze()
        this.app.sfx.pauseAudio('beep')
    }

    if (
        this.inMenu
        && (
            this.menuSlide == 'win'
            || this.menuSlide == 'loss'
        )
        && this.app.cursors.y.isDown
    ) {
        this.app.reset()
    }

    if (
        !this.inMenu
        && this.app.cursors.x.isDown
    ) {
        this.showMenuSlide(this.menuSlide)
        this.app.player.freeze()
        this.app.stop()
    }

    this.healthText.text = Math.round(this.app.player.health)
    this.timerText.text = Math.round(this.app.timeTotal / 1000.0) + '.' + Math.floor((this.app.timeTotal % 1000) / 100)

    this.drawGUI()
    this.filter.update()
}

GFX.prototype.drawGUI = function() {
    this.graphics.clear()

    // Grey border for energy bar
    this.graphics.beginFill(0x6a6a6a)
    this.graphics.lineStyle(10, 0x6a6a6a, 1)
    this.graphics.drawRoundedRect(-3, -3, 166, 26, 6)

    // Blue energy bar
    this.graphics.beginFill(0x0000ff)
    this.graphics.lineStyle(10, 0x0000ff, 1)
    this.graphics.drawRoundedRect(0, 0, Math.max(160 * this.app.player.health / this.app.player.maxHealth, 0), 20, 5)

    // Grey background for timer
    this.graphics.beginFill(0x6a6a6a)
    this.graphics.lineStyle(10, 0x6a6a6a, 1)
    this.graphics.drawRoundedRect(this.app.game.width - 275, -3, 166, 26, 6)
}

GFX.prototype.showMenuSlide = function(slide) {
    this.menuSlide = slide

    switch (slide) {
        case 'start':
            this.menuContent = '> Mission: Locate alien artifact in ruins\nand bring it back.\n> \nLoad personal profile:[a/d/left/right]\nlateral movement\n> [space] vertical movement\n> [x] show menu\n> [q/v] activate artifact\n> Close help? [y/n]'
            break

        case 'win':
            this.menuContent = '> Mission complete!\n> You have successfully\nretrieved the alien artifact\n> This belongs in a museum, but maybe you can\nplay with it for a while\n> \n> Play again? [y/n]'
            break

        case 'loss':
            this.menuContent = '> Detecting life signature... failed\n> Resending query\n> Detecting life signature... failed\n> Initiate protocol Last Will\n> Logging user out\n> Goodbye Captain\n> \n> Retry? [y/n]'
            break

        case 'pickup':
            this.menuContent = '> Scanning artifact... Done!\n> Full capabilities elude scanners, but strong\n> hints of time manipulation powers.\n> \n> Please use artifact responsibly.\n> \n> New mission parameters: Get out'
            break
    }

    this.menuScreen.visible = true
    this.menuText.visible = true
    this.menuText.text = ''
    this.inMenu = true
    this.menuFc = 0
}

GFX.prototype.reset = function() {
    this.graphics.clear()
    this.menuScreen.visible = false
    this.menuText.visible = false
    this.menuSlide = 'start'
}

GFX.prototype.timeStopEffects = function(flag) {
    if (flag) {
        this.app.game.stage.filters = [this.filter]
    } else {
        this.app.game.stage.filters = null
    }
}