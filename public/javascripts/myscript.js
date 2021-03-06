$(document).ready(exec);
var libraries = [];

function exec() {

    if (localStorage.getItem('theme') == null) {
        theme = 'xcode';
    } else {
        theme = localStorage.getItem('theme');
    }

    var h_editor = ace.edit("html_editor");
    h_editor.setTheme("ace/theme/" + theme);
    h_editor.session.setMode("ace/mode/html");
    h_editor.setShowPrintMargin(false);

    var c_editor = ace.edit("css_editor");
    c_editor.setTheme("ace/theme/" + theme);
    c_editor.session.setMode("ace/mode/css");
    c_editor.setShowPrintMargin(false);

    var j_editor = ace.edit("js_editor");
    j_editor.setTheme("ace/theme/" + theme);
    j_editor.session.setMode("ace/mode/javascript");
    j_editor.setShowPrintMargin(false);


    h_editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        tabSize: 2

    });

    c_editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    j_editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    $('.save').click(function() {
        var t = $('.title').val(); //get the title
        var pub = $('#pub').val(); // whether to publish
        var html_template_type = $('.html_type').val();
        save_file(h_editor, c_editor, j_editor, libraries, t, pub, html_template_type);
    });

    $(".post_details").click(show_post_details);

    $("#libraries").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: 'https://api.cdnjs.com/libraries?',
                dataType: "jsonp",
                data: {
                    search: request.term
                },
                success: function(data) {
                    response(data.results.map(x => ({ label: x.name, value: x.latest })));
                }
            });
        },
        appendTo: '#modal',
        minLength: 3,
        select: save_libraries
    });

    $('.expand_html').click(function() {
        $('.editors').css('grid-template-columns', '100% 0 0');
        $(".expand_html").addClass("btn-info").removeClass('btn-outline-info');
        $(".expand_css, .expand_js").removeClass("btn-info").addClass('btn-outline-info');

    });

    $('.expand_css').click(function() {
        $('.editors').css("grid-template-columns", '0 100% 0');
        $(".expand_css").addClass("btn-info").removeClass('btn-outline-info');
        $(".expand_html , .expand_js").removeClass("btn-info").addClass('btn-outline-info');


    });

    $('.expand_js').click(function() {
        $('.editors').css("grid-template-columns", '0 0 100%');
        $(".expand_js").addClass("btn-info").removeClass('btn-outline-info');;
        $(".expand_html , .expand_css").removeClass("btn-info").addClass('btn-outline-info');

    });

    $('.reset_view').click(function() {
        $('.editors').css("grid-template-columns", 'auto auto auto');
    });

    $('.fork').click(function() {
        save_file(h_editor, c_editor, j_editor, libraries);
    });


    function save_file(h_editor, c_editor, j_editor, l, t, p, html_template_type) {
        var h = h_editor.getValue(); //html content
        var c = c_editor.getValue(); // css content
        var j = j_editor.getValue(); // js content

        id = window.location.pathname;
        id = id.replace('/', '');
        var data = { html: h, css: c, js: j, id: id, libs: l, title: t, publish: p, template_type: html_template_type };
        $.ajax({
            url: '/save',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function(msg, textStatus, jqXHR) {
                console.log(msg);
                window.location.href = location.origin + '/' + msg.redirect;

            }
        });
    }

    function show_post_details() {
        $('#modal').toggleClass('modal_hide modal_show');
    }

    function save_libraries(event, ui) {
        console.log(ui.item);
        libraries.push(ui.item.value);
        $("#modal .post_details").before(`<p class='lib_link'> <span> ${ui.item.value} </span> <button class='rem'> Remove </button> </p>`);
        $('#modal .rem').click(remove_libraries);
    }

    function remove_libraries() {
        var w = $(this).prev().text().toString();
        var loc = libraries.indexOf(w);
        libraries.splice(loc, 1); //remove the library from array
        $(this).parent().remove();
    }


    $('#libraries').on('paste', function() {
        var element = this;
        setTimeout(function() {
            var link = $(element).val();
            console.log(link);
            libraries.push(link);
            $("#modal").append(`<p class='lib_link'> <span> ${link} </span> <button class='rem'> Remove </button> </p>`);
            $('#modal .rem').click(remove_libraries);
        }, 100);
    });


    $('.fa-moon').click(function() {
        h_editor.setTheme("ace/theme/ambiance");
        j_editor.setTheme("ace/theme/ambiance");
        c_editor.setTheme("ace/theme/ambiance");
        localStorage.setItem('theme', 'ambiance')


    });

    $('.fa-sun').click(function() {
        h_editor.setTheme("ace/theme/xcode");
        j_editor.setTheme("ace/theme/xcode");
        c_editor.setTheme("ace/theme/xcode");
        localStorage.setItem('theme', 'xcode')

    });


} // end of exec