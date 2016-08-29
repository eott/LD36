Map = function(app) {
    this.app = app
}

Map.prototype.preload = function() {
    this.app.game.load.image('wallsAndBackground', 'assets/images/background/walls_and_background.png')
    this.app.game.load.image('spears', 'assets/images/objects/spears.png')
    this.app.game.load.image('spikes', 'assets/images/objects/spikes.png')
    this.app.game.load.image('door', 'assets/images/objects/door.png')
    this.app.game.load.spritesheet('pickupHealth', 'assets/images/objects/pickup_health.png', 64, 64)
    this.app.game.load.spritesheet('pickupArtifact', 'assets/images/objects/pickup_artifact.png', 64, 64)
    this.app.game.load.tilemap('level', 'assets/maps/Level1.json', null, Phaser.Tilemap.TILED_JSON)
}

Map.prototype.create = function() {
    this.tilemap = this.app.game.add.tilemap('level')

    // Add the tileset images. The first parameter is the tileset name as
    // specified in Tiled, the second is the key to the asset.
    this.tilemap.addTilesetImage('walls_and_background', 'wallsAndBackground')

    // Create layers below traps
    this.backgroundLayer = this.tilemap.createLayer('Background')
    this.objectsLayer = this.tilemap.createLayer('Objects')

    // Prepare traps group
    this.trapsGroup = this.app.game.add.group()
    this.trapsGroup.enableBody = true

    // Add spikes
    var spikesStart = this.findObjectsByType('spikes', this.tilemap, 'Objects');
    for (var idx in spikesStart) {
        var trap = this.trapsGroup.create(spikesStart[idx].x, spikesStart[idx].y, 'spikes')
        trap.body.immovable = true
        trap.name = 'spikes'
        trap.damage = 15
        trap.nhd = 25
        trap.body.setSize(40, 40, 12, 12) // Forgiving hitboxes
    }

    // Add spears
    // Note that Phaser "helpfully" removes the height attribute, so we have to manually
    // adjust the height for non-square objects. Fuck you, Phaser.
    var spearsStart = this.findObjectsByType('spears', this.tilemap, 'Objects');
    for (var idx in spearsStart) {
        var trap = this.trapsGroup.create(spearsStart[idx].x, spearsStart[idx].y - 128, 'spears')
        trap.body.immovable = true
        trap.body.oy = trap.body.y
        trap.name = 'spears'
        trap.damage = 25
        trap.nhd = 45
        trap.flip = spearsStart[idx].properties.flipped
        trap.anchor.setTo(0, 0.5)
        trap.body.setSize(50, 178, 7, 7) // Forgiving hitboxes

        if (trap.flip) {
            trap.scale.y = -1
        }
    }

    // Create layers above traps
    this.wallsLayer = this.tilemap.createLayer('Walls')

    // Collision for walls
    // The second argument is the max amount of tiles that are used. You want
    // to keep it as close as possible to the actual amount due to performance
    // reasons
    this.tilemap.setCollisionBetween(1, 1500, true, 'Walls')

    // Resize the game world to match the layer dimensions
    this.wallsLayer.resizeWorld()

    // Create end level marker as sprite
    var markerPos = this.findObjectsByType('level_end', this.tilemap, 'Objects')
    for (var idx in markerPos) {
        this.endMarker = this.app.game.add.sprite(markerPos[idx].x, markerPos[idx].y - 64, 'door')
        this.app.game.physics.arcade.enable(this.endMarker)
        this.endMarker.body.immovable = true
    }

    // Add the artifact
    var markerPos = this.findObjectsByType('artifact', this.tilemap, 'Objects')
    for (var idx in markerPos) {
        this.artifact = this.app.game.add.sprite(markerPos[idx].x, markerPos[idx].y, 'pickupArtifact')
        this.app.game.physics.arcade.enable(this.artifact)
        this.artifact.body.immovable = true
        this.artifact.animations.add('spin', range, 20, true)
        this.artifact.animations.play('spin')
    }


    // Prepare battery group
    this.batteryGroup = this.app.game.add.group()
    this.batteryGroup.enableBody = true

    // Add batteries
    var range = this.app.player.range(20)
    var markerPos = this.findObjectsByType('battery', this.tilemap, 'Objects')
    for (var idx in markerPos) {
        var battery = this.batteryGroup.create(markerPos[idx].x, markerPos[idx].y, 'pickupHealth')
        battery.hasBeenUsed = false
        battery.body.immovable = true
        battery.animations.add('spin', range, 20, true)
        battery.animations.play('spin')
    }
}

Map.prototype.update = function() {
    if (this.app.isStopped || this.app.isTimeStopped) {
        return;
    }

    for (idx in this.trapsGroup.children) {
        var trap = this.trapsGroup.children[idx]
        if (trap.name == 'spears') {
            if (trap.flip) {
                trap.body.y = trap.body.oy + 3 * Math.abs(this.app.fc % 60 - 30)
            } else {
                trap.body.y = trap.body.oy - 3 * Math.abs(this.app.fc % 60 - 30)
            }
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
    for (idx in this.batteryGroup.children) {
        this.batteryGroup.children[idx].hasBeenUsed = false
        this.batteryGroup.children[idx].visible = true
    }
}