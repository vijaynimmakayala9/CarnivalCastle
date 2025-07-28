$(function () {
  $.ajax({
    url: "listlocations",
    method: "post",
    data: { "fetch-locations": !0 },
    success: function (t) {
      $("#data").html(
        '<div class="row wow fadeInLeft animated my-3 justify-content-center" id="locations"></div>'
      ),
        $();
      let a = JSON.parse(t);
      for (let e = 0; e < a.res.length; e++)
        $("#locations").append(`
            <div class="col-lg-4 my-3">
            <div class="card shadow" style="border-radius: 16px;">
            <div class="card-head">
            <img class="img-fluid" style="border-top-right-radius: 16px;
            border-top-left-radius: 16px;" src="assets/uploads/locations/${
              a.res[e].folder
            }/${a.res[e].image_name}">
            </div>
            <div class="card-body">
            <h5>${a.res[e].location_name}</h5>
            <p class="${
              a.res[e].available > 6 ? "text-primary" : "text-danger"
            } fw-bold">Total ${a.available} Slots Are Available For ${
          a.date
        }</p>
            </div>
            <div class="card-foot p-3">
            <input type="hidden" name="city" value="${a.res[e].city_id}">
            <input type="hidden" name="location" value="${
              a.res[e].location_id
            }">
            <a href="selectscreens/${
              a.res[e].location_id
            }" name="submit" value="submit" class="mb-3 theme-btn btn-style-one" id="bookscreen">
            <span class="btn-title">View Screens&nbsp;<i class="fa fa-paper-plane" aria-hidden="true"></i></span>
        </a>
            </div>
        </div> 
            </div>
            `);
    },
  });
  var t = new Date(),
    a = t.getMonth() + 1,
    e = t.getDate(),
    s = t.getFullYear();
  a < 10 && (a = "0" + a.toString()), e < 10 && (e = "0" + e.toString());
  var i = s + "-" + a + "-" + e;
  $("#inputdate").attr("min", i),
    $("#bookscreen").hover(function () {
      $(this).css("box-shadow", "0px 0px 0px #b9b9b9");
    }),
    $("#bookscreen").mouseleave(function () {
      $(this).css("box-shadow", " 10px 10px 10px #b9b9b9");
    }),
    $(".input-append.date").datepicker({}),
    $(".datepicker").datepicker({ autoclose: !0, startDate: new Date() }),
    $("input[type=checkbox]").change(function () {
      let t = $(this).val(),
        a = $(this).val();
      $.ajax({
        url: "setaddons",
        method: "POST",
        data: { "add-item": !0, addon_item_id: t },
        success: function (t) {
          $(`#itemd${a}`).hasClass("alert-primary2")
            ? ($(`#itemd${a}`).removeClass("alert-primary2"),
              $(`#status${a}`).html(
                ' Add To Booking &nbsp; <i class="fa fa-plus"></i>'
              ),
              $(`#itemtitle${a}`).removeClass("text-white"),
              $(`#itemprice${a}`).removeClass("text-white"))
            : ($(`#itemd${a}`).addClass("alert-primary2"),
              $(`#status${a}`).html(
                ' Added &nbsp; <i class="fa fa-check"></i>'
              ),
              $(`#itemtitle${a}`).addClass("text-white"),
              $(`#itemprice${a}`).addClass("text-white"));
        },
      });
    }),
    $("input[type=radio]").click(function () {
      $(this).attr("data-id");
    }),
    $("#city").change(function () {});
});
// for starting the confetti

const start = () => {
  setTimeout(function () {
    confetti.start();
  }, 1000); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
};

//  for stopping the confetti

const stop = () => {
  setTimeout(function () {
    confetti.stop();
  }, 5000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
};
// after this here we are calling both the function so it works
start();
stop();

// if you dont want to make it stop and make it infinite you can just remove the stop function ðŸ˜Š
