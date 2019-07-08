$(function() {
  let validated =  new Array(5).fill(0);
  $("#submit_button").prop("disabled", true);
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  function review(selector_id, msg, index){
    const sum = validated.reduce((partial_sum, next) => partial_sum + next,0);
    console.log(sum)
    if (sum == 5 ){
      console.log("**")
      $("#submit_button").prop("disabled", false)
    }
    else {
      $("#submit_button").prop("disabled", true)
    }
    if (validated[index] == 1){
      $(selector_id).text("");
    }
    else {
      $(selector_id).text(msg);
    }
  }
  $("#register_form_username").on('input',function(){
    const index = 0;
    if (this.value.length > 1){
      validated[index] = 1;
    }
    else {
      validated[index] = 0;
    }
    review("#register_error_username", "El nombre de usuario no es lo suficientemente largo", index);
  });
  $("#register_form_name").on('input' ,function(){
    const index = 1;
    if (this.value.length > 1){
      validated[index] = 1;
    }
    else {
      validated[index] = 0;
    }
    review("#register_error_name", "El nombre no es lo suficientemente largo", index);
  });
  $("#register_form_lastname").on('input', function(){
    const index = 2;
    if (this.value.length > 1){
      validated[index] = 1;
    }
    else {
      validated[index] = 0;
    }
    review("#register_error_lastname", "El apellido no es lo suficientemente largo", index);
  });
  $("#register_form_email").on('input', function(){
    const index = 3;
    if (isEmail(this.value)){
      validated[index] = 1;
    }
    else {
      validated[index] = 0;
    }
    review("#register_error_email", "El email no tiene el formato que corresponde", index);
  });
  $("#register_form_password").on('input', function(){
    const index = 4;
    if (this.value.length > 5){
      validated[index] = 1;
    }
    else {
      validated[index] = 0;
    }
    review("#register_error_password", "la clave no es lo suficientemente larga (6 caracteres)", index);
  });

});
