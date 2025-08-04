import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const PLAYER_SPEED_REGULAR = 500;
const PLAYER_SPEED_ANGLED = 200;
const BULLET_SPEED = 800;
const k = kaplay({
  background: [0, 0, 100],
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

// k.loadSprite("bean", "sprites/bean.png");
// k.add([k.pos(120, 80), k.sprite("bean")]);
// k.onClick(() => k.addKaboom(k.mousePos()));
k.loadSound("pew", "sounds/pew.mp3");

const player = add([
  polygon([
    vec2(30, 0), // Right point (nose pointing right)
    vec2(-10, -17), // Top left point
    vec2(-10, 17), // Bottom left point
  ]),
  pos(center()),
  rotate(0), // Add rotation component
  color(255, 0, 0),
  area(),
  "player",
]);

// Store player's current direction (starts facing right)
player.currentAngle = 0;

function getAngleFromKey(key) {
  // Return angle in degrees for each direction
  switch (key) {
    case "right":
      return 0; // 0 degrees = right
    case "down":
      return 90; // 90 degrees = down
    case "left":
      return 180; // 180 degrees = left
    case "up":
      return 270; // 270 degrees = up
    // Diagonal directions
    case "up-right":
      return 315; // 315 degrees = up-right
    case "down-right":
      return 45; // 45 degrees = down-right
    case "up-left":
      return 225; // 225 degrees = up-left
    case "down-left":
      return 135; // 135 degrees = down-left
    default:
      return 0;
  }
}

onKeyDown((key) => {
  const moves = ["up", "down", "left", "right"];
  if (moves.includes(key)) {
    let direction = key;
    let isAngled = false;
    if (isKeyDown("right") && isKeyDown("down")) {
      direction = "down-right";
      isAngled = true;
    }
    if (isKeyDown("right") && isKeyDown("up")) {
      direction = "up-right";
      isAngled = true;
    }
    if (isKeyDown("left") && isKeyDown("up")) {
      direction = "up-left";
      isAngled = true;
    }
    if (isKeyDown("left") && isKeyDown("down")) {
      direction = "down-left";
      isAngled = true;
    }
    const angle = getAngleFromKey(direction);
    // Update player's current direction
    player.currentAngle = angle;
    // Rotate the player to face the movement direction
    player.angle = angle;
    // Convert angle to movement vector
    const moveX =
      Math.cos((angle * Math.PI) / 180) *
      (isAngled ? PLAYER_SPEED_ANGLED : PLAYER_SPEED_REGULAR);
    const moveY =
      Math.sin((angle * Math.PI) / 180) *
      (isAngled ? PLAYER_SPEED_ANGLED : PLAYER_SPEED_REGULAR);

    player.move(moveX, moveY);

    // Keep player within screen bounds
    const playerRadius = 25; // Circle radius
    player.pos.x = Math.max(
      playerRadius,
      Math.min(width() - playerRadius, player.pos.x)
    );
    player.pos.y = Math.max(
      playerRadius,
      Math.min(height() - playerRadius, player.pos.y)
    );
  }

  // Check if both right and down are pressed
});
onKeyPress("space", () => {
  // Calculate bullet movement based on player's current direction
  const bulletMoveX =
    Math.cos((player.currentAngle * Math.PI) / 180) * BULLET_SPEED;
  const bulletMoveY =
    Math.sin((player.currentAngle * Math.PI) / 180) * BULLET_SPEED;

  const bullet = add([
    circle(4),
    pos(player.pos.x, player.pos.y),
    color(0, 255, 255),
    area(),
    "bullet",
  ]);

  play("pew", { volume: 1, speed: 1.1 });

  bullet.onUpdate(() => {
    bullet.move(bulletMoveX, bulletMoveY);

    // Remove bullet when it goes off screen
    if (
      bullet.pos.x > width() ||
      bullet.pos.x < 0 ||
      bullet.pos.y > height() ||
      bullet.pos.y < 0
    ) {
      destroy(bullet);
    }
  });
});
