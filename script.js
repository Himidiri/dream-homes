// Drop Down for property types and added dates
$(function () {
  $("#property-type").selectmenu();
});

$(function () {
  $("#date-added").selectmenu();
});

//Spiners for Min and Max Bedrooms
$(function () {
  $("#spinner1").spinner({
    min: 0,
    max: 12,
    spin: function (event, ui) {
      $(this).change();
    },
  });
});

$(function () {
  $("#spinner2").spinner({
    min: 0,
    max: 12,
    spin: function (event, ui) {
      $(this).change();
    },
  });
});

// Price Range Slider
$(function () {
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 1000000,
    values: [0, 1000000],
    slide: function (event, ui) {
      $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
    },
  });
  $("#amount").val(
    "$" +
      $("#slider-range").slider("values", 0) +
      " - $" +
      $("#slider-range").slider("values", 1)
  );
});

//Load the JSON file
$(document).ready(function () {
  $.ajax({
    url: "./properties.json",
    dataType: "json",
    success: function (data) {
      // Event Listener for the Search Button
      $("#search-property").on("click", function (e) {
        e.preventDefault();
        var postalCode = $("#postal-code").val();
        var propType = $("#property-type").val();
        var maxBed = $("#spinner1").val();
        var minBed = $("#spinner2").val();
        var date = $("#date-added").val();
        var minPrice = $("#slider-range").slider("option", "values")[0];
        var maxPrice = $("#slider-range").slider("option", "values")[1];

        $.ajax({
          url: "./properties.json",
          dataType: "json",
          success: function (data) {
            var properties = data.properties;

            var output = "<ul>";
            for (var i in data.properties) {
              if (postalCode === data.properties[i].postalCode) {
                if (propType == data.properties[i].type || propType == "Any")
                  if (
                    minBed >= data.properties[i].bedrooms &&
                    maxBed <= data.properties[i].bedrooms
                  )
                    if (
                      date == data.properties[i].added.month ||
                      date == "Anytime"
                    )
                      if (
                        data.properties[i].price >= minPrice &&
                        data.properties[i].price <= maxPrice
                      ) {
                        {
                          {
                            {
                              output +=
                                "<div class='procard'>" +
                                "<div class='proheading'>" +
                                "<h2><li>" +
                                "$" +
                                data.properties[i].price +
                                "</li></h2>" +
                                "</div>" +
                                "<div class='proimg'>" +
                                "<img src=" +
                                data.properties[i].picture +
                                ">" +
                                "</div>" +
                                "<div class='prodis'>" +
                                "<p>" +
                                data.properties[i].description +
                                "<button><a href='" +
                                data.properties[i].url +
                                "'>Visit Page</a></button>" +
                                "</p>" +
                                "</div>" +
                                "</div>";
                            }
                          }
                        }
                      }
              }
            }
            output += "</ul>";
            document.getElementById("Placeholder").innerHTML = output;
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(
              "An error occurred: " + textStatus + " - " + errorThrown
            );
          },
        });
      });
    },
  });
});

// Event Listener for the Add Favourites Button
$(function () {
  $(".addFavourites").on("click", function () {
    try {
      $(this).attr("disabled", true);

      var propIdToAdd = $(this).closest("div").attr("id");

      var favouriteProp = JSON.parse(localStorage.getItem("favPropList"));

      if (favouriteProp == null) {
        favouriteProp = [];
      }

      if (favouriteProp != null) {
        for (var j = 0; j < favouriteProp.length; j++) {
          if (propIdToAdd == favouriteProp[j]) {
            alert("This Property is Already in Your Favourites List");
            favouriteProp = [];
          }
        }
      }

      favouriteProp.push(propIdToAdd);

      localStorage.setItem("favPropList", JSON.stringify(favouriteProp));
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {
        console.log("Error : Local Storage Limit Exceeds");
      } else {
        console.log("Error : Saving to Local Storge.");
      }
    }
  });
});

// Event Listener for the Remove Favourites Button
$(function () {
  $(".removeFavourites").on("click", function () {
    $(this).attr("disabled", true);

    var propIdToRemove = $(this).closest("div").attr("id");

    myFavouriteProp = JSON.parse(localStorage.getItem("favPropList"));

    if (myFavouriteProp != null) {
      for (var j = 0; j < myFavouriteProp.length; j++) {
        if (propIdToRemove == myFavouriteProp[j]) {
          alert("This Property has been Removed");

          delete myFavouriteProp[j];

          localStorage.setItem("favPropList", JSON.stringify(myFavouriteProp));

          myFavouriteProp[j] = [];
        }
      }
    }

    if (myFavouriteProp == null) {
      alert("You have No Favourite Items");
    }
  });
});

//Load the JSON file
$(document).ready(function () {
  $.ajax({
    url: "./properties.json",
    dataType: "json",
    success: function (data) {
      // Event Listener for the View Favourites Button
      $(".viewFavourites").on("click", function (e) {
        e.preventDefault();
        console.log("Restoring array data from local storage");

        myFavouriteProp = JSON.parse(localStorage.getItem("favPropList"));

        $.ajax({
          url: "./properties.json",
          dataType: "json",
          success: function (data) {
            var properties = data.properties;

            var output = "<ul>";

            if (myFavouriteProp != null) {
              for (var i = 0; i < data.properties.length; i++) {
                for (j = 0; j < myFavouriteProp.length; j++) {
                  if (data.properties[i].id == myFavouriteProp[j]) {
                    output +=
                      '<div class="fav-container">' +
                      "<h5><li>" +
                      data.properties[i].bedrooms +
                      " Bedroom" +
                      " " +
                      data.properties[i].type +
                      "</li></h5>" +
                      "<img src=" +
                      data.properties[i].picture +
                      ">" +
                      "<li><button><a href=' " +
                      data.properties[i].url +
                      "'>Visit page</a></button></li>" +
                      "</div>";
                  }
                }
              }
            }
            output += "</ul>";

            document.getElementById("Placeholder2").innerHTML = output;
          },
        });
      });

      // Event Listener for the Clear Favourites Button
      $(function () {
        $(".clearFavourites").on("click", function (e) {
          e.preventDefault();
          $("#Placeholder2").remove();
          myFavouriteProp = JSON.parse(localStorage.getItem("favPropList"));
          localStorage.clear();
        });
      });
    },
  });
});

$(document).ready(function () {
  // Make the property card elements draggable
  $(".inforPropCard").draggable({
    helper: "clone",
  });
  // Handle the drop event on the "Favorites" section
  $(".dropFavourite").droppable({
    drop: function (event, ui) {
      try {
        $(this).attr("disabled", true);

        var propIdToAdd = ui.draggable.data("property-id");

        var favouriteProp = JSON.parse(localStorage.getItem("favPropList"));

        if (favouriteProp == null) {
          favouriteProp = [];
        }

        if (favouriteProp != null) {
          for (var j = 0; j < favouriteProp.length; j++) {
            if (propIdToAdd == favouriteProp[j]) {
              alert("This Property is Already in Your Favourites List");
              favouriteProp = [];
            }
          }
        }

        favouriteProp.push(propIdToAdd);

        localStorage.setItem("favPropList", JSON.stringify(favouriteProp));
      } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
          console.log("Error : Local Storage Limit Exceeds");
        } else {
          console.log("Error : Saving to Local Storge.");
        }
      }
    },
  });
});

// properties pages image slider
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  captionText.innerHTML = dots[slideIndex - 1].alt;
}

// Encorder
function htmlEncode(value) {
  return $("<div/>").text(value).html();
}

// ------------------------------------------------------
// $(document).ready(function () {
//   // Make the property card elements draggable
//   $(".inforPropCard").draggable({
//     helper: "clone",
//   });

//   $(".dropFavourite").droppable({
//     drop: function (event, ui) {
//       var propIdToAdd = ui.draggable.data("property-id");
//       var favouriteProp = JSON.parse(localStorage.getItem("favPropList"));
//       if (favouriteProp == null) {
//         favouriteProp = [];
//       }
//       if (favouriteProp != null) {
//         for (var j = 0; j < favouriteProp.length; j++) {
//           if (propIdToAdd == favouriteProp[j]) {
//             alert("This Property is Already in Your Favourites List");
//             favouriteProp = [];
//             return;
//           }
//         }
//       }
//       favouriteProp.push(propIdToAdd);
//       localStorage.setItem("favPropList", JSON.stringify(favouriteProp));

//       //Retrieve the image URL from the properties obtained from JSON file
//       $.ajax({
//         url: "./properties.json",
//         dataType: "json",
//         success: function (data) {
//           var properties = data.properties;
//           var propertyImage;
//           for (var i in properties) {
//             if (propIdToAdd === properties[i].id) {
//               propertyImage = properties[i].picture;
//               break;
//             }
//           }
//           //Append the image to the .favourite-properties section
//           $(".favourite-properties").append(
//             "<img src='" + propertyImage + "'/>"
//           );
//         },
//       });
//     },
//   });

//   //Retrieve the saved property IDs from local storage
//   $(document).ready(function () {
//     var favouriteProp = JSON.parse(localStorage.getItem("favPropList"));
//     if (favouriteProp != null) {
//       for (var i = 0; i < favouriteProp.length; i++) {
//         //Retrieve the image URL from the properties obtained from JSON file
//         $.ajax({
//           url: "./properties.json",
//           dataType: "json",
//           success: function (data) {
//             var properties = data.properties;
//             var propertyImage;
//             for (var j in properties) {
//               if (favouriteProp[i] === properties[j].id) {
//                 propertyImage = properties[j].picture;
//                 break;
//               }
//             }
//             //Append the image to the .favourite-properties section
//             $(".favourite-properties").append(
//               "<img src='" + propertyImage + "'/>"
//             );
//           },
//         });
//       }
//     }
//   });
// });

// --------------------------------------------
