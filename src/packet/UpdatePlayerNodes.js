var BinaryWriter = require("./BinaryWriter");

class UpdatePlayerNodes {
    constructor(playerNodes) {
        this.playerNodes = playerNodes;
    }

    build() {
        
        const data = this.playerNodes.map(playerNode => {
            return {
                nodeId: playerNode.nodeId,
                ownerId: playerNode.owner.pID,
                ownerName: playerNode.owner._name,
                skin: playerNode.owner._skin,
                color: playerNode.color,
                positionX: playerNode.position.x,
                positionY: playerNode.position.y,
                team: playerNode.owner.team,
                size: playerNode._size
            }
        })

        return {
            messageId: "updatedPlayerNodes",
            data
        }
    };
};

module.exports = UpdatePlayerNodes;