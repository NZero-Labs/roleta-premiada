// const Swal = require("sweetalert2");
var data = defaultItems;

var RouletteWheel = function (el, items) {
  this.$el = $(el);
  this.items = items || [];
  this._bis = false;
  this._angle = 0;
  this._index = 0;
  this.options = {
    angleOffset: -90,
  };
};

_.extend(RouletteWheel.prototype, Backbone.Events);

RouletteWheel.prototype.spin = function (_index) {
  var count = this.items.length;
  var delta = 360 / count;
  var index = !isNaN(parseInt(_index))
    ? parseInt(_index)
    : parseInt(Math.random() * count);

  var a = index * delta + (this._bis ? 1440 : -1440);

  //a+=this.options.angleOffset;

  this._bis = !this._bis;
  this._angle = a;
  this._index = index;

  var $spinner = $(this.$el.find(".spinner"));

  var _onAnimationBegin = function () {
    this.$el.addClass("busy");
    this.trigger("spin:start", this);
  };

  var _onAnimationComplete = function () {
    this.$el.removeClass("busy");
    this.trigger("spin:end", this);
  };

  $spinner.velocity("stop").velocity(
    {
      rotateZ: a + "deg",
    },
    {
      //easing: [20, 7],
      //easing: [200, 20],
      easing: "easeOutQuint",
      duration: 5000,
      begin: $.proxy(_onAnimationBegin, this),
      complete: $.proxy(_onAnimationComplete, this),
    }
  );
};

RouletteWheel.prototype.render = function () {
  var $spinner = $(this.$el.find(".spinner"));
  var D = this.$el.width();
  var R = D * 0.5;

  var count = this.items.length;
  var delta = 360 / count;

  var colors = ["#c1d116", "#76bc21", "#00953b"];
  for (var i = 0; i < count; i++) {
    var item = this.items[i];

    var color =
      item.type !== "replay"
        ? item.type !== "end"
          ? colors[i % colors.length]
          : "#9d9c9c"
        : "#ffc000";
    var text = item.text;
    var ikon = item.ikon;

    var html = [];
    html.push('<div class="item" ');
    html.push('data-index="' + i + '" ');
    html.push('data-type="' + item.type + '" ');
    html.push(">");
    html.push('<span class="label">');
    if (ikon) html.push('<i class="material-icons">' + ikon + "</i>");
    html.push('<span class="text">' + text + "</span>");
    html.push("</span>");
    html.push("</div>");

    var $item = $(html.join(""));

    var borderTopWidth = D + D * 0.0025; //0.0025 extra :D
    var deltaInRadians = (delta * Math.PI) / 180;
    var borderRightWidth = D / (1 / Math.tan(deltaInRadians));

    var r = delta * (count - i) + this.options.angleOffset - delta * 0.5;

    $item.css({
      borderTopWidth: borderTopWidth,
      borderRightWidth: borderRightWidth,
      transform: "scale(2) rotate(" + r + "deg)",
      borderTopColor: color,
    });

    var textHeight = parseInt(((2 * Math.PI * R) / count) * 0.5);
    $item.find(".label").css({
      //transform: 'translateX('+ (textHeight) +'px) translateY('+  (-1 * R) +'px) rotateZ('+ (90 + delta*.5) +'deg)',
      transform:
        "translateY(" +
        D * -0.25 +
        "px) translateX(" +
        textHeight * 1.03 +
        "px) rotateZ(" +
        (90 + delta * 0.5) +
        "deg)",
      height: textHeight + "px",
      lineHeight: textHeight + "px",
      textIndent: R * 0.1 + "px",
    });

    $spinner.append($item);
  }

  $spinner.css({
    fontSize: parseInt(R * 0.06) + "px",
  });

  //this.renderMarker();
};

RouletteWheel.prototype.renderMarker = function () {
  var $markers = $(this.$el.find(".markers"));
  var D = this.$el.width();
  var R = D * 0.5;

  var count = this.items.length;
  var delta = 360 / count;

  var borderTopWidth = D + D * 0.0025; //0.0025 extra :D
  var deltaInRadians = (delta * Math.PI) / 180;
  var borderRightWidth = D / (1 / Math.tan(deltaInRadians));

  var i = 0;
  var $markerA = $('<div class="marker">');
  var $markerB = $('<div class="marker">');

  var rA = delta * (count - i - 1) - delta * 0.5 + this.options.angleOffset;
  var rB = delta * (count - i + 1) - delta * 0.5 + this.options.angleOffset;

  $markerA.css({
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    transform: "scale(2) rotate(" + rA + "deg)",
    borderTopColor: "#FFF",
  });
  $markerB.css({
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    transform: "scale(2) rotate(" + rB + "deg)",
    borderTopColor: "#FFF",
  });

  $markers.append($markerA);
  $markers.append($markerB);
};

RouletteWheel.prototype.bindEvents = function () {
  this.$el.find(".button").on("click", $.proxy(this.spin, this));
};

var spinner;
$(window).ready(function () {
  spinner = new RouletteWheel($(".roulette"), data);
  spinner.render();
  spinner.bindEvents();

  // spinner.on("spin:start", function (r) {
  //   console.log("spin start!");
  // });
  spinner.on("spin:end", function (r) {
    Swal.fire({
      position: "center",
      icon:
        data[r._index].type === "replay"
          ? "warning"
          : data[r._index].type === "end"
          ? "error"
          : "success",
      title:
        data[r._index].type === "replay"
          ? "Gire outra vez!"
          : data[r._index].type === "end"
          ? "Não foi dessa vez!"
          : `Você ganhou um(a) ${data[r._index].text}!`,
      showConfirmButton: true,
      timer: 5000,
    });
  });
});
