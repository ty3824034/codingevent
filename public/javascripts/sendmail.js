var name1 = $('#name')
var phone = $('#phone')
var email = $('#email')
var message = $('#message')

function sendMail() {
    let formdata = {
        name: name1.val(),
        phone: phone.val(),
        email: email.val(),
        message: message.val()
    }

    $.post("/admin/contactus", formdata,
        function (serverdata) {
            if (serverdata) {
                alert('Message Sent\nWe will contact you soon. ')
            } else {
                alert('Message not sent')
            }
        }
    );
}