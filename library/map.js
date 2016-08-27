Map = function(app) {
    this.app = app
}

Map.prototype.preload = function() {
    this.app.game.load.image('labyrinthSprites', 'assets/images/background/labyrinth_spritesheet.png')
    this.app.game.load.tilemap('level', 'assets/maps/Dev.json', null, Phaser.Tilemap.TILED_JSON)
}

Map.prototype.create = function() {
    this.tilemap = this.app.game.add.tilemap('level')

    // Add the tileset images. The first parameter is the tileset name as
    // specified in Tiled, the second is the key to the asset.
    this.tilemap.addTilesetImage('labyrinth_spritesheet', 'labyrinthSprites')

    // Create layers
    this.objectsLayer = this.tilemap.createLayer('Objects')
    this.wallsLayer = this.tilemap.createLayer('Walls')

    // Collision for walls and furniture
    // The second argument is the max amount of tiles that are used. You want
    // to keep it as close as possible to the actual amount due to performance
    // reasons
    this.tilemap.setCollisionBetween(1, 500, true, 'Walls')

    // Resize the game world to match the layer dimensions
    this.wallsLayer.resizeWorld()
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