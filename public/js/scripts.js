var hasPwd = ''
var pwd = ''
var name = ''
var grpID = ''

var getUrlParameter = function (param) {
    var PageURL = decodeURIComponent(window.location.search.substring(1)),
        URLVariables = PageURL.split('&'),
        ParameterName,
        i;

    return new Promise((resolve) => {
        for (i = 0; i < URLVariables.length; i++) {
            ParameterName = URLVariables[i].split('=');

            if (ParameterName[0] == param) {
                resolve(ParameterName[1] == undefined ? true : ParameterName[1])
            }
        }
    })
}

var getBrowserLang = function (param) {
    var fullLang = param.split('-')[0]
    return fullLang[0]
}

function getHasPwd(grpID) {
    let url = 'http://' + window.location.host + '/haspwd'

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: url,
            data: {
                groupID: grpID
            },
            dataType: "json",
            success: function (data) {
                var ans = data.hasPwd

                resolve(ans)
            },
            error: function (err) {
                reject(err)
            }
        })
    })
}

function postInfo(info) {
    let url = 'http://' + window.location.host + '/notification'

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: url,
            data: info,
            dataType: "json",
            success: function (data) {
                var ans = data.msg
                resolve(ans)
            },
            error: function (err) {
                var ans = (strings['s_failed_while_sending_ring'][lang])
                reject(ans)
            }
        })
    })
}

function sendData() {
    name = $("#name_box_id").val()
    pwd = $("#password_box_id").val()

    if (grpID && grpID != '') {

        var info = {
            password: pwd,
            name: name == '' ? strings['s_someone'][lang] : name,
            groupID: grpID
        };

        $("#send_btn_id").prop('disabled', true)

        postInfo(info)
            .then((response) => {
                var msg

                if (response == 'success') {
                    msg = (strings['s_ring_sent'][lang])
                } else if (response == 'wrongpsw') {
                    msg = (strings['s_wrong_password'][lang])
                    $("#send_btn_id").prop('disabled', false)
                } else {
                    msg = (strings['s_failed_while_sending_ring'][lang])
                    $("#send_btn_id").prop('disabled', false)
                }

                // console.log(msg)
                window.alert(msg)
            }).catch((err) => {
                $("#send_btn_id").prop('disabled', false)

                // console.log(err)
                window.alert(err)
            })
    } else {
        window.alert(strings['s_undefined_doorbell'][lang])
    }
}

$(document).ready(() => {
    $("#name_label_id").text(strings['s_your_name'][lang])
    $("#name_box_id").attr("placeholder", strings['s_name'][lang])
    $("#password_label_id").text(strings['s_doorbell_password'][lang])
    $("#password_box_id").attr("placeholder", strings['s_password'][lang])
    $("#send_btn_id").val(strings['s_ring_doorbell'][lang])

    $("#send_btn_id").prop('disabled', true)

    getUrlParameter('i')
        .then((response) => {
            grpID = response

            return grpID
        })
        .then((response) => {
            getHasPwd(response)
                .then((ans) => {
                    $("#send_btn_id").prop('disabled', false)

                    hasPwd = ans

                    if (hasPwd != 'true') {
                        $(".password_class").hide()
                        if (hasPwd == 'not found') {
                            console.log(strings['s_doorbell_not_found'][lang])
                            window.alert(strings['s_doorbell_not_found'][lang])
                        }
                    } else {
                        $(".password_class").show()
                    }
                }).catch((err) => {
                    // console.log(strings['s_server_communication_error'][lang])
                    window.alert(strings['s_server_communication_error'][lang])
                })
        }).catch((err) => {
            // console.log(strings['s_server_communication_error'][lang])
            window.alert(strings['s_server_communication_error'][lang])
        })
})