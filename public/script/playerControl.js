var sja = sja || {};

sja.playerControl = (function() {
    "use strict";

    var playerSprite = sja.createSprite("player.png", 1, 1, 1),
        xTarget = 0,
        yTarget = 0,
        pixelMovementPerMs = 0.1,
        lastMovementTime = Date.now(),
        movePlayerCallbackId = -1;


    return {
        get playerSprite() { return playerSprite; },

        initPlayer: initPlayer,
        deInitPlayer: deInitPlayer
    };


    function initPlayer() {
        var middleOfScreen = sja.screen.canvasWidth / 2,
            bottomOfScreen = sja.screen.canvasHeight - playerSprite.height;

        setXyTarget(middleOfScreen, bottomOfScreen);
        playerSprite.move(middleOfScreen, bottomOfScreen);

        sja.canvas.onmousedown = onInput;
        sja.screen.addToRenderPreperation(movePlayerToTarget);
        sja.screen.addToRenderList(playerSprite);
    }

    function deInitPlayer() {
        sja.screen.removeFromRenderPreperation(movePlayerCallbackId);
        movePlayerCallbackId = -1;
        sja.canvas.onmousedown = "";
    }

    function onInput(event) {
        var actualX = event.pageX - sja.canvas.offsetLeft,
            actualY = event.pageY - sja.canvas.offsetTop;

        setXyTarget(actualX, actualY);
    }

    function setXyTarget(x, y) {
        xTarget = Math.round(x - (playerSprite.width / 2));
        yTarget = Math.round(y - (playerSprite.height / 2));
    }

    function movePlayerToTarget() {
        var timeSinceLastMovement = Date.now() - lastMovementTime,
            pixelsToMove = Math.round(timeSinceLastMovement * pixelMovementPerMs),
            newXPos = playerSprite.x,
            newYPos = playerSprite.y,
            i;

        for (i = 0; i < pixelsToMove; i++) {
            if (playerSprite.x < xTarget) {
                newXPos++;
            } else if (playerSprite.x > xTarget) {
                newXPos--;
            }

            if (playerSprite.y < yTarget) {
                newYPos++;
            } else if (playerSprite.y > yTarget) {
                newYPos--;
            }
        }

        lastMovementTime = Date.now();

        if (xPosIsOffscreen(newXPos)) {
            newXPos = playerSprite.x;
        } else if (yPosIsOffscreen(newYPos)) {
            newYPos = playerSprite.y;
        }

        playerSprite.move(newXPos, newYPos);
    }

    function xPosIsOffscreen(x) {
        if (x < 0) {
            return true;
        } else if (x + playerSprite.width > sja.screen.canvasWidth) {
            return true;
        }

        return false;
    }

    function yPosIsOffscreen(y) {
        if (y < 0) {
            return true;
        } else if (y + playerSprite.height > sja.screen.canvasHeight) {
            return true;
        }

        return false;
    }
})();
