Map = function(app) {
    this.app = app
}

Map.prototype.preload = function() {
    this.app.game.load.image('labyrinthSprites', 'assets/images/background/labyrinth_spritesheet.png')
    this.app.game.load.image('spears', 'assets/images/objects/spears.png')
    this.app.game.load.spritesheet('gameObjects', 'assets/images/objects/game_objects.png', 64, 64)
    this.app.game.load.tilemap('level', 'assets/maps/Dev.json', null, Phaser.Tilemap.TILED_JSON)
}

Map.prototype.create = function() {
    this.tilemap = this.app.game.add.tilemap('level')

    // Add the tileset images. The first parameter is the tileset name as
    // specified in Tiled, the second is the key to the asset.
    this.tilemap.addTilesetImage('labyrinth_spritesheet', 'labyrinthSprites')

    // Create layers below traps
    this.backgroundLayer = this.tilemap.createLayer('Background')
    this.objectsLayer = this.tilemap.createLayer('Objects')

    // Prepare traps group
    this.trapsGroup = this.app.game.add.group()
    this.trapsGroup.enableBody = true

    // Add spikes
    var spikesStart = this.findObjectsByType('spikes', this.tilemap, 'Objects');
    for (var idx in spikesStart) {
        var trap = this.trapsGroup.create(spikesStart[idx].x, spikesStart[idx].y, 'gameObjects')
        trap.body.immovable = true
        trap.frame = 10
        trap.name = 'spikes'
        trap.damage = 10
        trap.nhd = 10
    }

    // Add spears
    // Note that Phaser "helpfully" removes the height attribute, so we have to manually
    // adjust the height for non-square objects. Fuck you, Phaser.
    var spearsStart = this.findObjectsByType('spears', this.tilemap, 'Objects');
    for (var idx in spearsStart) {
        var trap = this.trapsGroup.create(spearsStart[idx].x, spearsStart[idx].y - 128, 'spears')
        trap.body.immovable = true
        trap.body.oy = trap.body.y
        trap.frame = 0
        trap.name = 'spears'
        trap.damage = 35
        trap.nhd = 30
    }

    // Create layers above traps
    this.wallsLayer = this.tilemap.createLayer('Walls')

    // Collision for walls
    // The second argument is the max amount of tiles that are used. You want
    // to keep it as close as possible to the actual amount due to performance
    // reasons
    this.tilemap.setCollisionBetween(1, 500, true, 'Walls')

    // Resize the game world to match the layer dimensions
    this.wallsLayer.resizeWorld()

    // Create end level marker as sprite
    // For dev we use the gameObjects sprite, for prod we use no image
    var markerPos = this.findObjectsByType('level_end', this.tilemap, 'Objects')
    for (var idx in markerPos) {
        this.endMarker = this.app.game.add.sprite(markerPos[idx].x, markerPos[idx].y, 'gameObjects')
        this.endMarker.frame = 2
        this.app.game.physics.arcade.enable(this.endMarker)
        this.endMarker.body.immovable = true
    }
}

Map.prototype.update = function() {
    if (this.app.isStopped || this.app.isTimeStopped) {
        return;
    }

    for (idx in this.trapsGroup.children) {
        var trap = this.trapsGroup.children[idx]
        if (trap.name == 'spears') {
            trap.body.y = trap.body.oy - 3 * Math.abs(this.app.fc % 60 - 30)
        }
    }
}

Map.prototype.findObjectsByType = function(type, map, layer) {
    var result = new Array()
    map.objects[layer].forEach(function (element) {
        if (element.type === type || element.properties.type === type) {
            // Phaser uses top left, Tiled bottom left so we have to adjust
            // the y position; this breaks with non-square objects
            element.y -= map.tileHeight
            result.push(element)
        }
    })
    return result
}

Map.prototype.reset = function() {
    
}