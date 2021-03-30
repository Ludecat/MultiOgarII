var BinaryWriter = require("./BinaryWriter");

class UpdatePlayerNodes {
    constructor(playerNodes) {
        this.playerNodes = playerNodes;
    }

    build() {

        const data = this.playerNodes.map(playerNode => {
            return {
                lastNodeId: playerNode.lastNodeId,
                ownerName: playerNode.owner._name,
                skin: playerNode.owner._skin,
                color: playerNode.color,
                positionX: playerNode.position.x,
                positionY: playerNode.position.y,
                team: playerNode.owner.team
            }
        })

        return {
            messageId: "updatedPlayerNodes",
            data
        }
    };
};

module.exports = UpdatePlayerNodes;