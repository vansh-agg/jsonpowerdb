$("#rollno").focus();

var jpdbbaseurl="http://api.login2explore.com:5577"
var jpdbirl="/api/irl"
var jpdbiml="/api/iml"
var dbname="SCHOOL_DB"
var relationname="STUDENT-TABLE"
var connToken="90931669|-31949327237013356|90961511"

function saverecnno(jsonobj){
    var lvdata=JSON.parse(jsonobj.data);
    localStorage.setItem("recno",lvdata.rec_no);
}
function getidasjson(){
    var rollno=$('#rollno').val()
    var jsonStr={
        rollno:rollno
    }
    return JSON.stringify(jsonStr)
}

function filldata(jsonobj){
    saverecnno(jsonobj);
    var data=JSON.parse(jsonobj.data).record;

    $("#empName").val(data.empName);
    $("#class").val(data.class);
    $("#address").val(data.address);
    $("#enrollment").val(data.enrollment);
    $("#birthdate").val(data.birthdate);
}
function validateData() {
    var rollno = $("#rollno").val();
    if (rollno === "") {
        alert("Roll no Required Value");
        $("#rollno").focus();
        return "";
    }
    var NameVar = $("#empName").val();
    if (NameVar === "") {
        alert("Name is Required Value");
        $("#empName").focus();
        return "";
    }
    var classvar = $("#class").val();
    if (classvar === "") {
        alert("Class is Required Value");
        $("#class").focus();
        return "";
    }
    var birthdate = $("#birthdate").val();
    if (birthdate === "") {
        alert("birthdate is Required Value");
        $("#birthdate").focus();
        return "";
    }
    var address = $("#address").val();
    if (address === "") {
        alert("address is Required Value");
        $("#address").focus();
        return "";
    }
    var enrollmentdate = $("#enrollment").val();
    if (enrollmentdate === "") {
        alert("Enrollment date is Required Value");
        $("#enrollment").focus();
        return "";
    }
    var jsonStrObj = {
        rollno: rollno,
        empName: NameVar,
        class: classvar,
        birthdate:birthdate,
        address:address,
        enrollment:enrollmentdate
    };
    return JSON.stringify(jsonStrObj);
}

function resetform() {
    $("#rollno").val("")
    $("#empName").val("");
    $("#class").val("");
    $("#address").val("");
    $("#enrollment").val("");
    $("#birthdate").val("");
    $("#rollno").prop('disabled',false);
    $("#stusave").prop('disabled',true);
    $("#stuchange").prop('disabled',true);
    $("#stureset").prop('disabled',true);
    $("#rollno").focus();
}

function savestudent() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(connToken,
        jsonStr, dbname, relationname);

    jQuery.ajaxSetup({
        async: false
    });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,
        jpdbbaseurl, jpdbiml);
    jQuery.ajaxSetup({
        async: true
    });
    resetform();
    $("#rollno").focus();
}

function changestudent(){
    $('#stuchange').prop('disabled',true)
    jsonchange=validateData();
    var updatereq=createUPDATERecordRequest(connToken,jsonchange,dbname,relationname,localStorage.getItem('recno'))
    jQuery.ajaxSetup({
        async: false
    });
    var resultObj = executeCommandAtGivenBaseUrl(updatereq,
        jpdbbaseurl, jpdbiml);
    jQuery.ajaxSetup({
        async: true
    });
    resetform();
    $("#rollno").focus();
}

function getstudent(){
    var rolljsonobj=getidasjson();
    var getrequest=createGET_BY_KEYRequest(connToken,dbname,relationname,rolljsonobj);
    jQuery.ajaxSetup({
        async: false
    });
    var resultObj = executeCommandAtGivenBaseUrl(getrequest,
        jpdbbaseurl, jpdbiml);
    jQuery.ajaxSetup({
        async: true
    });
    if(resultObj.status===400){
        $('#stusave').prop('disabled',false)
        $('#stureset').prop('disabled',false)
        $('#empName').focus();
    }
    else if (resultObj.status===200){
        $('#rollno').prop('disabled',false);
        filldata(resultObj)
        $('#stuchange').prop('disabled',false)
        $('#stureset').prop('disabled',false)
        $('#empName').focus();
    }
}