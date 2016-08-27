Map = function(app) {
    this.app = app
}

Map.prototype.preload = function() {
    this.app.game.load.image('labyrinthSprites', 'assets/images/background/labyrinth_spritesheet.png')
    this.app.game.load.spritesheet('gameObjects', 'assets/images/objects/game_objects.png', 64, 64)
    this.app.game.load.tilemap('level', 'assets/maps/Dev.json', null, Phaser.Tilemap.TILED_JSON)
}

Map.prototype.create = function() {
    this.tilemap = this.app.game.add.tilemap('level')

    // Add the tileset images. The first parameter is the tileset name as
    // specified in Tiled, the second is the key to the asset.
    this.tilemap.addTilesetImage('labyrinth_spritesheet', 'labyrinthSprites')

    // Create layers
    this.backgroundLayer = this.tilemap.createLayer('Background')
    this.objectsLayer = this.tilemap.createLayer('Objects')
    this.wallsLayer = this.tilemap.createLayer('Walls')

    // Collision for walls and furniture
    // The second argument is the max amount of tiles that are used. You want
    // to keep it as close as possible to the actual amount due to performance
    // reasons
    this.tilemap.setCollisionBetween(1, 500, true, 'Walls')

    // Resize the game world to match the layer dimensions
    this.wallsLayer.resizeWorld()

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
}

Map.prototype.update = function() {
    
}

Map.prototype.findObjectsByType = function(type, map, layer) {
    var result = new Array()
    map.objects[layer].forEach(function (element) {
        if (element.type === type || element.properties.type === type) {
            // Phaser uses top left, Tiled bottom left so we have to adjust
            // the y position
            element.y -= map.tileHeight
            result.push(element)
        }
    })
    return result
}