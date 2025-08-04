import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const PLAYER_SPEED = 500;
const k = kaplay({
  background: [0, 0, 100],
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

// k.loadSprite("bean", "sprites/bean.png");
// k.add([k.pos(120, 80), k.sprite("bean")]);
// k.onClick(() => k.addKaboom(k.mousePos()));
k.loadSound("pew", "sounds/pew.mp3");

const player = add([
  circle(25),
  pos(center()),
  color(255, 0, 0),
  area(),
  "player",
]);

onKeyDown((key) => {
  const moves = ["up", "down", "left", "right"];
  if (moves.includes(key)) {
    player.move(
      key === "left" ? -PLAYER_SPEED : key === "right" ? PLAYER_SPEED : 0,
      key === "up" ? -PLAYER_SPEED : key === "down" ? PLAYER_SPEED : 0
    );
  }
});
onKeyPress("space", () => {
  const bullet = add(
    [rect(10, 4), pos(player.pos.x + 10, player.pos.y), color(255, 255, 255)],
    "bullet"
  );
  play("pew", { volume: 1, speed: 1.1 });
  bullet.onUpdate(() => {
    bullet.move(400, 0); // Move 400 pixels per second to the right

    // Remove bullet when it goes off screen
    if (bullet.pos.x > width()) {
      destroy(bullet);
    }
  });
});
