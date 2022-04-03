
$(document).ready(function () {

    function updateClock() {
        var now = new Date(), // current date
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // you get the idea
            time = now.getHours() + ':' + now.getMinutes(); // again, you get the idea
    
            // a cleaner way than string concatenation
            date = [now.getDate(), 
                    months[now.getMonth()],
                    now.getFullYear()].join(' ');
    
        // set the content of the element with the ID time to the formatted string
        document.getElementById('time').innerHTML = [date, time].join(' / ');
    
        // call this function again in 1000ms
        setTimeout(updateClock, 1000);
    }
    updateClock(); // initial call
 
    //Back to Guest Page
    $("#backtoQuest").click(function (e) {
        $("#guest_layout").show();
        $("#guest_questions").hide();
    });

    $('#frmCase input').keydown(function (e) {

        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });

    //Email validation for schools.nyc for guest
    $("#guest_email").blur(function (e) {

        validateSchoolsEmail($(this))

    })

    $("#frmCase").submit(function (event) {
        event.preventDefault();

        $(".question-submit .btn-primary").attr("disabled", "disabled").html('<span class="spinner-grow spinner-grow-sm position-relative text-light" role="status" style="top:-2px"></span> <span>Submitting...</span>');

        $("#errorMessages").hide();
        $(".validation-summary-valid ul").empty();

        // only for consent
        if ($(".guest-consent-menu").hasClass("active")) {
            setConsentType();
        }

        var formData = $(this).serialize();

        $.ajax({
            url: this.action,
            type: this.method,
            data: formData,
            success: function (data) {
                OnAjaxStop();

                $(".question-submit .btn-primary").prop("disabled", false).html('<span>Submit Consent</span>');

                if (data.success) {

                    //For Guest only for consent SUbmit
                    if (data.model == "consent") {

                        if ($('#consentsuccessalert').length == 0) {
                            $("#consent_layout .card").after('<div id ="consentsuccessalert" class="alert alert-success mb-4 alert-dismissible fade show" role="alert"><strong>Success!</strong> Your COVID-19 testing consent has been saved successfully. <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
                        }
                    }
                    else {
                        //FOr loggined user diplay success message
                        switch (data.model.TYPE) {
                            case "E":
                            case "G":
                            case "S":
                            case "P":
                            case "A":
                                GetSuccess(formData);
                                break;
                        }
                    }
                }
                else {

                    // if model errors 
                    $.each(data.errors, function (key, message) {
                        $(".validation-summary-valid ul").prepend('<li>' + message + '</li>');
                        if (message.indexOf("Phone") > -1) {
                            $("#errorMessages").hide();
                            $("#btnDailyScreeningSubmit .btn").click();
                        }
                    });

                    //For case submit and diplay errors
                    if (data.model != "consent") {
                        $("#backtoQuest").click();
                        $('#errorMessages').show();
                    }
                    else {
                        //Move error messgages after consent text
                        $('#errorMessages').insertAfter($(".card")).show()
                    }

                    $('html, body').animate({
                        scrollTop: ($(".validation-summary-valid").offset().top)
                    }, 100);
                }
            },
            error: function (xhr, textstatus) {

                if (xhr.status === 419) {
                    logout();
                }

                OnAjaxStop();

                if (xhr.status != 401) {
                    // Error COde here
                }
            }
        });
    });

    var PrequestionAnswer = $('[name="PrequestionAnswer"]')
    $(PrequestionAnswer).on("click", function () {

        var answer = $(this);

        if (answer.val() == 1) {
            $(".pre-school-under-questionarie").show();
            $(".staff-school-questionarie").hide();
            $(".pre-school-question-div").find("input").prop("checked", false);
            $(".pre-school-question-div").hide().eq(0).show();
            $(".question-div").find("input").prop("checked", false);
            $(".question-div").hide();
            
        }

        if (answer.val() == 0) {
            $(".pre-school-under-questionarie").hide();
            $(".staff-school-questionarie").show();
            $(".pre-school-question-div").find("input").prop("checked", false);
            $(".pre-school-question-div").hide();
            $(".question-div").find("input").prop("checked", false);
            $(".question-div").hide().eq(0).show();
           
        }
       
      
    });

    var PreQuestions = $('[name="PreAnswer1"],[name="PreAnswer2"],[name="PreAnswer3"]')
    $(PreQuestions).on("click", function () {
         
        var answer = $(this);

        if (answer.val() == 0) {
            answer.parents(".pre-school-question-div").addClass("checked").next().slideDown(120);


            if ($(this).attr("id") == "pq1yes3") {
                //$("#pq3no").click();
                $(".pre-school-question-div").eq(1).hide();
                $(".pre-school-question-div").eq(2).hide();
            }
            else {

                if ($(this).attr("id") == "pq1no" || $(this).attr("id") == "pq1yes1" || $(this).attr("id") == "pq1yes2") {

                    $("#pq2no").prop("checked", false); // reset question 3 radio button
                    $("#pq2yes1").prop("checked", false); // reset question 3 radio
                    $("#pq2yes3").prop("checked", false); // reset question 3 radio button
                   
                    $("#pq2yes2").prop("checked", false); // reset question 3 radio button

                   

                    $(".question-submit").slideUp(120);
                }
            }

            if ($(this).attr("id") == "pq2yes1" || $(this).attr("id") == "pq2yes3") {
                //$("#pq3no").click();
                $(".pre-school-question-div").eq(2).hide();
            }
            else

                if ($(this).attr("id") == "pq2no") {

                $("#pq3no").prop("checked", false); // reset question 3 radio button
                $("#pq3yes1").prop("checked", false); // reset question 3 radio
                $("#pq3yes2").prop("checked", false); // reset question 3 radio button
                    $("#pq3yes3").prop("checked", false); // reset question 3 radio button
                    $("#pq3yes5").prop("checked", false);
                    
                $("#pq3yes4").prop("checked", false); // reset question 3 radio button
                    

                 $(".question-submit").slideUp(120); 
                }

            // show submit for last question or vaccination questions (Yes optionn only)
            if ($(this).attr("name") == "PreAnswer3" || $(this).attr("id") == "pq1yes3" || $(this).attr("id") == "pq1yes4" || $(this).attr("id") == "pq2yes2" || $(this).attr("id") == "pq2yes1" || $(this).attr("id") == "pq2yes3") {
                $(".question-submit").slideDown(120);
            } else {
                $(".question-submit").slideUp(120);
            }
        } else {

            qyes = 1;
            answer.parents(".pre-school-question-div").addClass("checked");
            var slideDiv = "no";
            $(".pre-school-question-div").each(function (idx) {

                if (slideDiv == "yes") {
                    $(this).slideUp(120);
                    $(this).find("input:checked").prop("checked", false);
                    $(".question-submit").slideDown(120);
                }

                if ($(this).find("input:checked").val() == 1) {
                    slideDiv = "yes";
                }

            });
        }


        if ($("input[name='PreAnswer3']:checked").val() == 1 || $("input[name='PreAnswer3']:checked").val() == 0) {
            $(".question-submit").slideDown(120);
        }

    });

   // var Questions = $('[name="Answer1"],[name="Answer2"],[name="Answer3"],[name="Answer4"],[name="Answer5"]')
    var Questions = $('[name="Answer1"],[name="Answer2"],[name="Answer3"]')
    $(Questions).on("click", function () {
        
        var answer = $(this);

        if (answer.val() == 0) {
            answer.parents(".question-div").addClass("checked").next().slideDown(120);
            // console.log($(this).attr("name"))
             
            if ($(this).attr("id") == "q2yes2") {
                $("#q3no").click();
                $(".question-div").eq(2).hide();
            }
            else
                //if ($(this).attr("id") == "q2yes2") {

                //    $("#q3no").prop("checked", false); // reset question 4 radio button
                //    $("#q3yes").prop("checked", false); // reset question 4 radio button
                //    $(".question-div").eq(4).hide(); // skip question 4
                //}
                //else 
                if ($(this).attr("id") == "q2no" || $(this).attr("id") == "q2yes" || $(this).attr("id") == "q2yes2") {

                    $("#q3no").prop("checked", false); // reset question 3 radio button
                    $("#q3Yes1").prop("checked", false); // reset question 3 radio
                    $("#q3Yes2").prop("checked", false); // reset question 3 radio button
                    $("#q3Yes3").prop("checked", false); // reset question 3 radio button
                    
                    $("#q3Yes4").prop("checked", false); // reset question 3 radio button
                    $("#q3Yes5").prop("checked", false); // reset question 3 radio button
                   

                    $(".question-submit").slideUp(120);
                }

            // show submit for last question or vaccination questions (Yes optionn only)
            if ($(this).attr("name") == "Answer3" || $(this).attr("id") == "q2yes1" || $(this).attr("id") == "q2yes2") {
                $(".question-submit").slideDown(120);
            } else {
                $(".question-submit").slideUp(120);
            }
        } else {

            qyes = 1;
            answer.parents(".question-div").addClass("checked");
            var slideDiv = "no";
            $(".question-div").each(function (idx) {

                if (slideDiv == "yes") {
                    $(this).slideUp(120);
                    $(this).find("input:checked").prop("checked", false);
                    $(".question-submit").slideDown(120);
                }

                if ($(this).find("input:checked").val() == 1) {
                    slideDiv = "yes";
                }

            });
        }


        if ($("input[name='Answer3']:checked").val() == 1 || $("input[name='Answer3']:checked").val() == 0) {
            $(".question-submit").slideDown(120);
        }

    });

    $("#other_checked").on("click", function () {

        var dropdownlist = $("#Location").data("kendoDropDownList");

        if ($("#other_checked").prop('checked') == true) {

            $("#IsOther").val(true);
            $("#guest_location").removeAttr("disabled").show().val("");

            $(".guest-loc .k-dropdown-wrap").removeClass("k-invalid");
            dropdownlist.select(0);
            dropdownlist.enable(false);
            $("input[name=Location]").parents(".k-widget").hide();

        } else {
            $("#IsOther").val(false);
            $("#guest_location").attr("disabled", "disabled").hide();

            resetLocations();
            $("input[name=Location]").parents(".k-widget").show();

        }
    })

    if (window.location.href.indexOf("type=G") > -1) {
        $(".navbar-nav .nav-item").on("click", function () {

            // After badge success then come back to Guest User page
            if ($("#guest_badges").is(":visible")) {
                navigate();
                $("#guest_questions").hide();
                $("#guest_layout").show();
            }

            var frmCaseAction = $('#frmCase').attr('action');

            $('#frmCase').attr('action', frmCaseAction.replace("home/submit", "consent/guestsubmit"));
            $("#guest_badges").hide();

            $("input[name='Answer']").attr('name', 'ConsentViewModel.Answer');
            $("input[name='ConsentType']").attr('name', 'ConsentViewModel.ConsentType');


            // Active hightlight
            if ($(this).hasClass("active") == false) {
                $(".navbar-nav .nav-item").toggleClass("active");
                $("#guest_isStudent, #guest_isVisitor").prop("checked", false).attr("disabled", "disabled");
                $("#guest_isNonDOE").prop("checked", true);

                $("#guest_phone").attr("required", "required").parent().prev().remove();

                navigate();

                resetLocations();

                //Other Options hide for consent
                $("#guest_location").attr("disabled", "disabled").hide();
                $('#other_checked').prop('checked', false).hide();
                $("#other_label").hide();
            }

            // If consent form is already showing consent/ hide questions
            if ($("#questions_layout").is(":visible")) {

                $("#guest_layout").show();
                $("#consent_layout, #guest_questions, .pre-school-under-questionarie, .question-submit").hide();
            }

            $("#guest_identity_form").find(".btn-primary").text("Fill Out Consent").attr("onclick", "showLayout('#consent_layout')");

        })
    }

    $("input[name='IsStudent'] ").on("click", function (e) {

        navigate();

        //Location drop reset
        resetLocations();

    })

    if ($("#guest_phone").length != 0) {
        $("#guest_phone").kendoMaskedTextBox({
            mask: "(000) 000-0000"
        });
    }

});

function resetLocations() {
    var dropdownlist = $("#Location").data("kendoDropDownList");
    dropdownlist.text(dropdownlist.options.optionLabel);
    dropdownlist.select(0);
    dropdownlist.enable(true);
    dropdownlist.dataSource.read();
}

function validateSchoolsEmail(emailField) {
    if ($('#emp_consent_msg').length == 0) {
        displayEmailMsg(emailField);
    } else {
        hideEmailMsg();
    }
}

function displayEmailMsg(emailField) {

    if (emailField.val().indexOf("schools.nyc.gov") > -1 && $('#guest_isNonDOE').is(':checked') && $(".guest-consent-menu").hasClass("active")) {
        $("#btnDailyScreeningSubmit .btn").attr("disabled", "disabled");
        emailField.parent().next().after('<div class="col-12" id="emp_consent_msg"><div class="p-2 alert alert-warning text-center"><i class="fas fa-user-circle"></i> DOE Employees must <a class="alert-link" href="/healthscreening/home/login">sign in</a> to give consent.</div>');
    }
}

function hideEmailMsg() {
    $('#emp_consent_msg').remove();
    $("#btnDailyScreeningSubmit .btn").removeAttr("disabled");
}

function navigate() {

    $("#guest_address, #guest_address1, #guest_city, #guest_state, #guest_zip").removeAttr('required');
    $("#address_field, #address1_field, #city_field, #state_field, #zip_field").addClass("d-none");
    $("#guest_address, #guest_address1, #guest_city, #guest_state, #guest_zip").attr('disabled');

    // Other Label and checkbox reset and show and text to Other
    $('#other_checked').prop('checked', false).show();
    $("#other_label span").html("Other").show();
    $("#other_label").show();

    // Other text field hide AND disabled
    $("#guest_location").attr("disabled", "disabled").hide();

    $(".guest-consent-menu").hide();

    $("#email_field").removeClass("col-6 col-md-6").addClass("col-lg-12");
    $("#phone_field").addClass("d-none");
    $("#guest_phone").data("kendoMaskedTextBox").enable(false);

    switch ($('input[name="IsStudent"]:checked').val()) {
        //Non Doe
        case "2":
            $("#email_field").removeClass("col-lg-12").addClass("col-6 col-md-6");
            $("#phone_field").removeClass("d-none")

            $("#guest_phone").data("kendoMaskedTextBox").enable(true);

            $(".guest-consent-menu").show();

            $("input[name=Location]").parents(".k-widget").show();
            break;
    }
}

function OnAjaxStart() {

    $('#overlay').show();
}

function OnAjaxStop() {

    $('#overlay').hide();
}

function showQuestion(type) {

    if (type.length != 1 && (type != 'E' || type !='P' || type != 'A' || type != 'S')) {
        return false;
    }

    if (type == "E" || type == 'P' || type == 'A' || type == 'S') {

        $(".question-div").find("input").prop("checked", false);
        $(".question-div").hide();
        $(".pre-school-question-div").find("input").prop("checked", false);
        $(".pre-school-question-div").hide();
        $(".pre-question-div").find("input").prop("checked", false);
        $(".pre-question-div").show();
        
        $(".question-submit").hide();

        $("#guest_questions").show();
        $(".question-submit .btn-primary").removeAttr("disabled").html('Submit Screening');
    }

    else {

        location.reload();
    }

    $("#guest_badges").hide();
}

//function GetSuccess(caseId, type) {

//    var url = $("#successURL").val();

//    setTimeout(function (x) {

//        $.get(url + "/" + Number(x), function (data) {

//            $("#guest_badges_content").html(data).show();
//            $("#guest_badges").show();

//            $("div").scrollTop();

//            $("#guest_questions").hide();


//        });
//    }, 500, caseId);

//}


function GetSuccess(formdata) {

    var url = $("#successURL").val();
     
    $.get(url, formdata, function (data) {
         
        $("#guest_badges_content").html(data).show();
        $("#guest_badges").show();

        $("div").scrollTop();

        $("#guest_questions").hide();

    });
}

function showLayout(layout) {

    if (layout == "#guest_questions") {
        showGuestName();
    }

    validateSchoolsEmail($('#guest_email'))

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {

        if (form.checkValidity() === false) {
            //event.preventDefault();
            //event.stopPropagation();
            form.classList.add('was-validated');

            if ($("#Location").data("kendoDropDownList").value() == "" && $("#Location").prop("disabled") == false) {
                $(".guest-loc .k-dropdown-wrap").addClass("k-invalid");
            }

        } else {


            if ($("#Location").data("kendoDropDownList").value() == "" && $("#Location").prop("disabled") == false) {
                $(".guest-loc .k-dropdown-wrap").addClass("k-invalid");
            }

            //reset form
            if ($(".guest-loc .k-dropdown-wrap").hasClass("k-invalid")) {
                return false;
            }

            //$(".question-div").find("input").prop("checked", false);
            //$(".question-div").hide().eq(0).show();
            $(".pre-question-div").find("input").prop("checked", false);
            $(".pre-question-div").show();
            $(".question-submit").hide();
            $(".tracker-layout").hide(150);
            $(layout).slideDown(150);
            $('.needs-validation').removeClass("was-validated")

            if (layout == "#consent_layout") {
                $("#consent_layout, #guest_questions, .question-div, .question-submit").show();
                $("#questions_layout").hide();
                showGuestName();
                $("#errorMessages").hide();
            }


        }
    });
}

function showGuestName() {
    var guestFName = $("").val().charAt(0).toUpperCase() + $("").val().slice(1);
    var guestLName = $("").val().charAt(0).toUpperCase() + $("").val().slice(1);
    $("#display_guest_first_name").text(guestFName);
    $("#display_guest_last_name").text(guestLName);
}

function onLocMenuChange(e) {

    e.preventDefault();

    var dataItem = this.dataItem(e.item);
    if (dataItem.Value != "" && $(".k-invalid").length > 0) {
        $(".guest-loc .k-dropdown-wrap").removeClass("k-invalid");
    }
}

function onLocationEnterText() {

    var dropdown = $('#Location').data("kendoDropDownList");
    var filter = dropdown.dataSource.filter();

    var type = null;

    switch ($("input[name='IsStudent']:checked").val()) {
        case "2":
            type = "NonDOE"
            break;
        case "3":
            type = "CBO"
            break;
    }

    if (filter && filter.filters.length > 0 && filter.filters[0].operator == "contains") {

        return {
            locationName: filter.filters[0].value,
            type: type
        };
    }
    else {
        return {
            locationName: dropdown.value(),
            type: type
        };
    }
}

function setConsentType() {

    switch ($("input[name='IsStudent']:checked").val()) {
        //Non DIOE
        case "2":
            var consentType = $("#other_checked").prop('checked') ? "Summer" : null;
            $("#ConsentType").val(consentType)
            break;
        //CBO
        case "3":
            $("#ConsentType").val("Summer")
            break;

        default:
            $("#ConsentType").val(null);
    }
}

/* function updateClock() {
    var now = new Date(), // current date
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // you get the idea
        time = now.getHours() + ':' + now.getMinutes(); // again, you get the idea

        // a cleaner way than string concatenation
        date = [now.getDate(), 
                months[now.getMonth()],
                now.getFullYear()].join(' ');

    // set the content of the element with the ID time to the formatted string
    document.getElementById('time').innerHTML = [date, time].join(' / ');

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}
updateClock(); // initial call */