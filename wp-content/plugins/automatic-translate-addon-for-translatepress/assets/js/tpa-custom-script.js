! function(window, $){
    // Get Ajax Url 
    var ajaxUrl = extradata['ajax_url'];
    var nonce = extradata['nonce'];
    var default_lang = jQuery("#trp-language-select").find("option:first-child").val();
    var pageLang =tpa_language_code(default_lang);
    localStorage.setItem("page_lang",pageLang);
    /**
    * Add Auto Translate Button & Steps
    */
    jQuery( "#trp-language-switch" ).before('<div><label class="tpa-steps">Step 1 - Select Language</label></div>');
    jQuery("#trp-next-previous").after('<div><label class="tpa-steps">Step 2 - Click Auto Translate </label></div><button id="tpa-auto-btn">Auto Translate</button>');
    var default_lang = jQuery("#trp-language-select").find("option:first-child").val();
    var getSelectedlang = $("#trp-language-select").val();
    if(default_lang==getSelectedlang){
       $("#tpa-auto-btn").attr('disabled', true); 
        jQuery("button#tpa-auto-btn:disabled").css({
            "background-color": "#dddddd",
            "border-color": "#dddddd",
            "background-color": "#cccccc",
            "color": "#fff",
            "padding": "8px",
            "cursor":"pointer"
        });
    }
    else{
        $("#tpa-auto-btn").attr('disabled', false); 
        jQuery("#tpa-auto-btn").addClass("enabled");
        jQuery("button#tpa-auto-btn.enabled").css({"border-color" : "#007cba",
            "color": "#fff",
            "text-decoration": "none",
            "text-shadow": "none",
            "padding": "8px",
            "margin-left": "0px",
            "background-color": "#007cba",
            "cursor":"pointer"
        });
    }
    /**
    * Apply Css for auto translate button & Steps
    */
    jQuery(".tpa-steps").css({ 
        "font-size":"18px",
        "color": "#000",
        "padding": "0",
        "font-weight": "600"
    });
    jQuery("span.select2-selection.select2-selection--single").css({
        "margin-top": "5px"
    });
    settingsModel();
    createStringsPopup();
    var dict_id= new Array();
    var gettxt_id = new Array();
    /**
    * Enable/Disable Button On Language Change
    */
    jQuery('#trp-language-select').on('change', function(){
        var default_lang = jQuery("#trp-language-select").find("option:first-child").val();
        var getSelectedlang = $(this).val();
        if(default_lang==getSelectedlang){
            $("#tpa-auto-btn").attr('disabled', true); 
            jQuery("button#tpa-auto-btn:disabled").css({
                "background-color": "#dddddd",
                "border-color": "#dddddd",
                "background-color": "#cccccc",
                "color": "#fff",
                "padding": "8px",
                "cursor":"pointer"
            });
        }
        else{
            jQuery("#tpa-auto-btn").attr('disabled', false); 
            jQuery("#tpa-auto-btn").addClass("enabled");
            jQuery("button#tpa-auto-btn.enabled").css({"border-color" : "#007cba",
                "color": "#fff",
                "text-decoration": "none",
                "text-shadow": "none",
                "padding": "8px",
                "margin-left": "0px",
                "background-color": "#007cba",
                "cursor":"pointer"
            });
        }
    });
    /**
    * After Click On Auto Translate Button 
    */
    $('#tpa-auto-btn').click(function(event) {
        /**
        * Get Dictionary Ids
        */
       jQuery('#trp-string-categories optgroup option[data-group="String List"]').each(function(x,el){
        var data_group =  $(this).attr("data-group");
        var database_id =$(this).attr('data-database-id');
        var id = $(this).attr("value");
        var person = database_id;
            dict_id[x]=database_id;
        });
        /**
        * 
        * Gettext Ids
        */
        jQuery('#trp-string-categories optgroup option[data-group="Gettext Strings"]').each(function(x,el){
            var data_group =  $(this).attr("data-group");
            var database_id =$(this).attr('data-database-id');
            var id = $(this).attr("value");
            var person = database_id;
            gettxt_id[x]=database_id;
        });
        var getSelectedlang=$("#trp-language-select").val();
        var default_lang = jQuery("#trp-language-select").find("option:first-child").val();
        var defaultLang = tpa_language_code(getSelectedlang);
        localStorage.setItem("language_code",defaultLang);
        localStorage.setItem("language_name",getSelectedlang);
        localStorage.setItem("default_language",default_lang);
        localStorage.setItem("dictionary_id",dict_id);
        localStorage.setItem("gettxt_id",gettxt_id);
       
        createPopup();
    });
    /**
    * create auto translate popup
    */
    function createPopup() {
        var style= $("#atlt-dialog").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        }).css("background-color","#E4D4D4");
    }
    var encodeHtmlEntity = function(str) {
        return str;
        var buf = [];
        for (var i = str.length - 1; i >= 0; i--) {
            buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
        }
        return buf.join('');
    };
    /*
    *
    * load strings in popup table 
    */
    function printStringsInPopup(jsonObj, type,group,idss) {
        $(".notice-container.notice.inline.notice-warning").remove();
           $("#ytWidget").show();
           $(".string_container").show();
           $(".choose-lang").show();
           $(".save_it").show();
        var html = '';
        var totalTChars = 0;
        var index = 1;
        if (jsonObj) {
            for (const key in jsonObj) {
                if (jsonObj.hasOwnProperty(key)) {
                    const groups = group[key];
                    const element = jsonObj[key];
                    if (element.source != '') {
                        if (type == "google" || type == "yandex") {
                            html += '<tr id="' + key + '" ><td>' + index + '</td><td  class="notranslate source" data-group='+group[key]+' data-db-id='+idss[key]+'>' + element +'</td>';
                        } else {
                            if (key > 2500) {
                                break;
                            }
                            html += '<tr id="' + key + '" ><td>' + index + '</td><td  class="notranslate source" data-group='+group[key]+' data-db-id='+idss[key]+'>' + element + '</td>';
                        }
                        if (type == "google") {
                            html += '<td class="target translate">' + element + '</td></tr>';
                        } else if (type == "yandex") {
                            html += '<td  translate="yes"  class="target translate">' + element + '</td></tr>';
                        } else {
                            html += '<td class="target translate"></td></tr>';
                        }
                        index++;
                        totalTChars += element.length;
                    }
                }
            }
            if (type == "google") {
                $(".gtstats").each(function() {
                    $(this).find(".totalChars").html(totalTChars);
                });

            } else if (type == "yandex") {
                $(".ytstats").each(function() {
                    $(this).find(".totalChars").html(totalTChars);
                });
            } else {
                $(".dtstats").each(function() {
                    $(this).find(".totalChars").html(totalTChars);
                });
            }

        }
        if (type == "google") {
            $("#string_tbl").html(html);
        } else if (type == "yandex") {
            $("#yandex_string_tbl").html(html);
        } else {
            $("#deepl_string_tbl").html(html);
        }
    }
    // Get the modal id
    var gModal = jQuery('.modal.tpa_custom_model').attr('id');
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == gModal) {
            gModal.style.display = "none";
        }
    }
    $("#tpa_strings_model").find(".notice-dismiss").on("click", function() {
    $(".notice.inline.notice-info.is-dismissible").fadeOut("slow");
    });
    // Get the <span> element that closes the modal
    $("#tpa_strings_model").find(".close").on("click", function() {
        $("#tpa_strings_model").fadeOut("slow");
    });
    /**
    * 
    * create auto translate settings popup
    */
    function settingsModel() {
        let ytPreviewImg = extradata['yt_preview'];
        let gtPreviewImg = extradata['gt_preview'];
        let dplPreviewImg = extradata['dpl_preview'];
        let modelHTML = ` 
        <!-- The Modal -->
          <div id="atlt-dialog" title="Step 3 - Select Translation Provider" >
          <div class="atlt-settings" style="opacity:1;">
          <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Yandex Page Translate Widget</strong>
          <div class="inputGroup">
          <button id="tpa_yandex_transate_btn" class="notranslate button button-primary">Yandex Translate</button>
          <span class="proonly-button alsofree">✔ Available</span>
          <br/><a href="https://translate.yandex.com/" target="_blank"><img style="margin-top: 5px;" src="${ytPreviewImg}" alt="powered by Yandex Translate Widget"></a>
          </div>
          <hr/>
        <strong class="atlt-heading" style="margin-bottom:10px;display:inline-block;">Translate Using Google Page Translate Widget</strong>
          <div class="inputGroup">
          <button id="tpa_gtranslate_btn" class="notranslate button button-primary">Google Translate</button>
          <span class="proonly-button"><a href="https://coolplugins.net/product/automatic-translate-addon-for-translatepress-pro/?utm_source=plugin_dashboard&utm_medium=box" target="_blank" title="Buy Pro">💎 Buy Pro</a></span>
          <br/><a href="https://translate.google.com/" target="_blank"><img style="margin-top: 5px;" src="${gtPreviewImg}" alt="powered by Google Translate Widget"></a>
          </div>
          <hr/>
              
        <ul class="tpa-feature" style="margin: 0;">
          <li><span style="color:green">✔</span> Unlimited Translations<br/></li>
          <li><span style="color:green">✔</span> No API Key Required</li>
          <li><span style="color:green">✔</span> Check Languages Support - <a href="https://yandex.com/support/translate/supported-langs.html" target="_blank">Yandex</a>, <a href="https://en.wikipedia.org/wiki/Google_Translate#Supported_languages" target="_blank">Google</a></li>
          </ul>
    
          </div>
          </div>`;
        $("body").append(modelHTML);
    }
    /**
    * generate model popup HTML
    */
    function createStringsPopup_() {
        let modelHTML = ` 
        <!-- The Modal -->
        <div id="tpa_strings_model" class="modal tpa_custom_model">
            <!-- Modal content -->
            <div class="modal-content">
              <input type="hidden" id="project_id" >
              <div class="modal-header">
                <span class="close ">&times;</span>
                <h2 class="notranslate">Step 4 - Start Automatic Translation Process</h2>
                <div class="save_btn_cont">
                <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
                </div>
                <div style="display:none" class="ytstats hidden">
                  Wahooo! You have saved your valauble time via auto translating 
                   <strong class="totalChars"> </strong> characters  using 
                    <strong> 
                    <a href="https://wordpress.org/support/plugin/automatic-translate-addon-for-translatepress/reviews/#new-post" target="_new">
                    Automatic Translate Addon For TranslatePress</a>
                  </strong>     
                </div></div>
                <div class="notice inline notice-info is-dismissible">Machine translations are not 100% correct. Please verify strings before using on production website.
                <br/>Also Google Translate provides better machine translations than Yandex. <a href="https://coolplugins.net/product/automatic-translate-addon-for-translatepress-pro/?utm_source=plugin_dashboard&utm_medium=widget" target="_blank">Pro version</a> provides unlimited translations via Google Page Translate Widget.
                 <button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
                 </div>
                <div class="modal-body">
                <div class="my_translate_progress">Automatic translation is in progress....<br/>It will take few minutes, enjoy ☕ coffee in this time!<br/><br/>Please do not leave this window or browser tab while translation is in progress...</div>
                <h3 class="choose-lang">Choose language <span class="dashicons-before dashicons-translation"></span></h3>
                <div id="ytWidget">..Loading</div>
                <br/>
                <div class="string_container">               
                    <table class="scrolldown" id="stringTemplate">
                        <thead>
                        <th class="notranslate">S.No</th>
                        <th class="notranslate">Source Text</th>
                        <th class="notranslate">Translation</th>
                        </thead>
                        <tbody id="yandex_string_tbl">
                        </tbody>
                    </table>
                </div>
                <div class="notice-container"></div>
              </div>
          <div class="modal-footer">
                <div class="save_btn_cont">
                <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
                </div>
                <div style="display:none" class="ytstats">
                Wahooo! You have saved your valauble time via auto translating 
                   <strong class="totalChars"></strong> characters  using 
                    <strong> 
                    <a href="https://wordpress.org/support/plugin/automatic-translate-addon-for-translatepress/reviews/#new-post" target="_new">
                    Automatic Translate Addon For TranslatePress</a>
                  </strong>     
                </div>
          </div>
            </div>
          </div>`;
        $("body").append(modelHTML);
    }

    /**
    * generate model popup HTML
    */
     function createStringsPopup() {
        let modelHTML = ` 
        <!-- The Modal -->
        <div id="tpa_strings_model" class="modal tpa_custom_model">
            <!-- Modal content -->
            <div class="modal-content">
              <input type="hidden" id="project_id" >
              <div class="modal-header">
                <span class="close ">&times;</span>
                <h2 class="notranslate">Step 4 - Start Automatic Translation Process</h2>
                <div class="save_btn_cont">
                <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
                </div>
                <div style="display:none" class="gtstats hidden">
                  Wahooo! You have saved your valauble time via auto translating 
                   <strong class="totalChars"> </strong> characters  using 
                    <strong> 
                    <a href="https://wordpress.org/support/plugin/automatic-translate-addon-for-translatepress/reviews/#new-post" target="_new">
                    Automatic Translate Addon For TranslatePress</a>
                  </strong>     
                </div></div>
                <div class="notice inline notice-info is-dismissible">Machine translations are not 100% correct. Please verify strings before using on production website.
                <br/>Also Google Translate provides better machine translations than Yandex. <a href="https://coolplugins.net/product/automatic-translate-addon-for-translatepress-pro/?utm_source=plugin_dashboard&utm_medium=widget" target="_blank">Pro version</a> provides unlimited translations via Google Page Translate Widget.
                 <button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
                 </div>
                <div class="modal-body">
                <div class="my_translate_progress">Automatic translation is in progress....<br/>It will take few minutes, enjoy ☕ coffee in this time!<br/><br/>Please do not leave this window or browser tab while translation is in progress...</div>
                <h3 class="choose-lang">Choose language <span class="dashicons-before dashicons-translation"></span></h3>
                <div id="google_translate_element"></div>
                <br/>
                <div class="string_container">               
                    <table class="scrolldown" id="stringTemplate">
                        <thead>
                        <th class="notranslate">S.No</th>
                        <th class="notranslate">Source Text</th>
                        <th class="notranslate">Translation</th>
                        </thead>
                        <tbody id="string_tbl">
                        </tbody>
                    </table>
                </div>
                <div class="notice-container"></div>
              </div>
          <div class="modal-footer">
                <div class="save_btn_cont">
                <button class="notranslate save_it button button-primary" disabled="true">Merge Translation</button>
                </div>
                <div style="display:none" class="gtstats">
                Wahooo! You have saved your valauble time via auto translating 
                   <strong class="totalChars"></strong> characters  using 
                    <strong> 
                    <a href="https://wordpress.org/support/plugin/automatic-translate-addon-for-translatepress/reviews/#new-post" target="_new">
                    Automatic Translate Addon For TranslatePress</a>
                  </strong>     
                </div>
          </div>
            </div>
          </div>`;
        $("body").append(modelHTML);
    }


    

     /*-----------Google integration---------*/
     /*
        Google Translate Model
      */
     // Get the modal
     var gModal = document.getElementById("tpa_strings_model");

     // When the user clicks anywhere outside of the modal, close it
     window.onclick = function(event) {
         if (event.target == gModal) {
             gModal.style.display = "none";
         }
     };

     // Get the <span> element that closes the modal

     // When the user clicks on <span> (x), close the modal
     $("#tpa_strings_model").find(".close").on("click", function() {
         $("#tpa_strings_model").fadeOut("slow");
     });
     // Get the button that opens the modal
     // var gTranslateBtn = document.getElementById("tpa_gtranslate_btn");

     // When the user clicks the button, open the modal 
     $("#tpa_gtranslate_btn_1").on("click", function() {
         var container = $("#tpa_strings_model");
         var defaultcode = localStorage.getItem("language_code");
         switch (defaultcode) {
             case 'bel':
                 defaultlang = 'be';
                 break;
             case 'he':
                 defaultlang = 'iw';
                 break;
             case 'snd':
                 defaultlang = 'sd';
                 break;
             case 'jv':
                 defaultlang = 'jw';
                 break;
             case 'nb':
                 defaultlang = 'no';
                 break;

             case 'nn':
                 defaultlang = 'no';
                 break;
             default:
                 defaultlang = defaultcode;
                 break;
         }
         var arr = ['en', 'zh', 'no', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'];
         if (arr.includes(defaultlang)) {
             googleTranslateElementInit();
         } else {
             $(".google-notice-container").addClass('notice inline notice-warning')
                 .html("Google Automatic Translator Does not support this language.");
             $(".choose-lang").hide();

             container.find(".string_container").hide();
             container.find(".save_it").hide();
         }
         // get only plain strings 
         var plainStrArr = filterRawObject(allStrings, "plain");

         if (plainStrArr.length > 0) {
             printStringsInPopup(plainStrArr, type = "yandex");
         } else {
             $(".google-notice-container").addClass('notice inline notice-warning')
                 .html("There is no plain string available for translations.");
             $(".choose-lang").hide();
             container.find(".string_container").hide();
             container.find(".save_it").hide();
         }
         $("#atlt-dialog").dialog("close");
         $("#tpa_strings_model").fadeIn("slow");

     });

     //scroll down model on language changes
     $("#google_translate_element").change(function() {
         // alert("change occured");
         var container = $("#tpa_strings_model");
         container.find(".string_container").scrollTop(0);
         var scrollHeight = container.find('.string_container').get(0).scrollHeight;
         var scrollSpeed = 10000;
         if (scrollHeight > scrollSpeed) {
             scrollSpeed = scrollHeight;
         }
         if (scrollHeight !== undefined && scrollHeight > 100) {
             container.find(".my_translate_progress").fadeIn("slow");
             setTimeout(() => {
                 container.find(".string_container").animate({
                     scrollTop: scrollHeight + 2000
                 }, scrollSpeed * 2, 'linear');
             }, 2000);

             container.find('.string_container').on('scroll', function() {
                 if ($(this).scrollTop() + $(this).innerHeight() + 50 >= $(this)[0].scrollHeight) {
                     setTimeout(() => {
                         container.find(".save_it").prop("disabled", false);
                         container.find(".gtstats").fadeIn("slow");
                         container.find(".my_translate_progress").fadeOut("slow");
                         container.find(".string_container").stop();
                         $('body').css('top', '0');
                     }, 1500);
                 }
             });

             if (container.find('.string_container').innerHeight() + 10 >= scrollHeight) {
                 setTimeout(() => {
                     container.find(".save_it").prop("disabled", false);
                     container.find(".gtstats").fadeIn("slow");
                     container.find(".my_translate_progress").fadeOut("slow");
                     container.find(".string_container").stop();
                     $('body').css('top', '0');
                 }, 1500);
             }
         } else {
             setTimeout(() => {
                 container.find(".save_it").prop("disabled", false);
                 container.find(".gtstats").fadeIn("slow");
             }, 2000);
         }
     });

     /**
    * 
    *  When the user clicks Google button, open the modal 
    */
    $("#tpa_gtranslate_btn").on("click", function() {
        /**
       * Add translate attribute with html tag
       */
      jQuery("html").attr('translate', 'no');
       $(".save_it").prop("disabled", true);
       $(".gtstats").css("display", "none");
       var default_code = localStorage.getItem("language_code");
       var arr = ['en','pl','af', 'jv', 'no', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr', 'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt', 'udm', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'zh'];
       if (arr.includes(default_code)) {
            googleTranslateElementInit();
           var language_code = localStorage.getItem("language_name");
           var default_lang = localStorage.getItem("default_language");
           var current_page_db_id = localStorage.getItem("dictionary_id");
           var gettxt_id =  localStorage.getItem("gettxt_id");
           var request_data = {
               'action':'tpa_get_strings',
               'data': language_code,
               'dictionary_id':current_page_db_id,
               'gettxt_id':gettxt_id,
               'default_lang':default_lang,
               '_ajax_nonce':nonce,
           };
           jQuery.ajax({
               type: "POST",
               url: ajaxUrl,
               dataType: 'json',
               data: request_data,
               success: function(response) {
                   var plainStrArr = response;
                   var strings= new Array();
                   var group = new Array();
                   var idss = new Array();
                   var i = 0;
                   plainStrArr.forEach(function(entry) {
                       strings[i] = entry.strings;
                       group[i] = entry.data_group;
                       idss[i]=entry.database_ids;
                       i++;
                   });
                   if (plainStrArr.length > 0) {
                     printStringsInPopup(strings, type = "google",group,idss);
                   } else {
                       $("#google_translate_element").hide();
                       if( $("#tpa_strings_model .notice-container").length > 0){
                           $(".notice-container").addClass('notice inline notice-warning')
                           .html("There is no plain string available for translations.");
                       }else{
                           $(".modal-content").append("<div class='notice-container'></div>")
                           $(".notice-container").addClass('notice inline notice-warning')
                           .html("There is no plain string available for translations.");
                       }
                       $(".string_container").hide();
                       $(".choose-lang").hide();
                       $(".save_it").hide();
                   }
               }
           });
       } else {
           $(".notice-container").addClass('notice inline notice-warning')
           .html("Google Automatic Translator Does not support this language.");
           $(".string_container").hide();
           $(".choose-lang").hide();
           $(".save_it").hide();
           $("#google_translate_element").hide();
       }
       var style1 = {};
           $("#tpa_gtranslate_btn").css(style1);
         $("#tpa-dialog").dialog("close");
         $("#tpa_strings_model").addClass("tpa_custom_model").fadeIn("slow");
   });
     
    /**
    * 
    *  When the user clicks Yandex button, open the modal 
    */
    $("#tpa_yandex_transate_btn").on("click", function() {
         /**
        * Add translate attribute with html tag
        */
       jQuery("html").attr('translate', 'no');
        $(".save_it").prop("disabled", true);
        $(".ytstats").css("display", "none");
        var default_code = localStorage.getItem("language_code");
        var arr = ['en','pl','af', 'jv', 'no', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr', 'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'sl', 'sq', 'sr', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt', 'udm', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'zh'];
        if (arr.includes(default_code)) {
            var language_code = localStorage.getItem("language_name");
            var default_lang = localStorage.getItem("default_language");
            var current_page_db_id = localStorage.getItem("dictionary_id");
            var gettxt_id =  localStorage.getItem("gettxt_id");
            var request_data = {
                'action':'tpa_get_strings',
                'data': language_code,
                'dictionary_id':current_page_db_id,
                'gettxt_id':gettxt_id,
                'default_lang':default_lang,
                '_ajax_nonce':nonce,
            };
            jQuery.ajax({
                type: "POST",
                url: ajaxUrl,
                dataType: 'json',
                data: request_data,
                success: function(response) {
                    var plainStrArr = response;
                    var strings= new Array();
                    var group = new Array();
                    var idss = new Array();
                    var i = 0;
                    plainStrArr.forEach(function(entry) {
                        strings[i] = entry.strings;
                        group[i] = entry.data_group;
                        idss[i]=entry.database_ids;
                        i++;
                    });
                    if (plainStrArr.length > 0) {
                      printStringsInPopup(strings, type = "yandex",group,idss);
                    } else {
                        $("#ytWidget").hide();
                        if( $("#tpa_strings_model .notice-container").length > 0){
                            $(".notice-container").addClass('notice inline notice-warning')
                            .html("There is no plain string available for translations.");
                        }else{
                            $(".modal-content").append("<div class='notice-container'></div>")
                            $(".notice-container").addClass('notice inline notice-warning')
                            .html("There is no plain string available for translations.");
                        }
                        $(".string_container").hide();
                        $(".choose-lang").hide();
                        $(".save_it").hide();
                    }
                }
            });
        } else {
            $(".notice-container").addClass('notice inline notice-warning')
            .html("Yandex Automatic Translator Does not support this language.");
            $(".string_container").hide();
            $(".choose-lang").hide();
            $(".save_it").hide();
            $("#ytWidget").hide();
        }
        var style1 = {};
            $("#tpa_yandex_transate_btn").css(style1);
          $("#atlt-dialog").dialog("close");
          $("#tpa_strings_model").addClass("tpa_custom_model").fadeIn("slow");
    });
    /**
    * This function used for save translated strings in database
    */
    $(".save_it").on("click", function() {
       var translatedObj = [];
        $("#stringTemplate tbody tr").each(function(index) {
           var index = $(this).find("td.source").text();
           var source = $(this).find("td.source").text();
           var target = $(this).find("td.target").text();
            var type = $(this).find("td.source").data("group");
            var db_id = $(this).find("td.source").data("db-id");
            var language_code = localStorage.getItem("language_name");
           var default_lang = localStorage.getItem("default_language");
            translatedObj.push({
            "original": source,
            "translated": target,
            "data_group":type,
            "language_code":language_code,
            "id":db_id,
            "status":"2",
            "default_lang":default_lang
            });
        });
        var data = {
            'action': 'tpa_save_translations',
            'data': JSON.stringify(translatedObj),
            '_ajax_nonce':nonce,
        };
        // Close merge translation function
        jQuery.post(ajaxUrl, data, function(response) {
            $("#tpa_strings_model").fadeOut("slow");
            location.reload();
        });
    }); 
    /**
    * 
    * This function is used to get language code
    */
    function tpa_language_code(getSelectedlang){
        var response = getSelectedlang.substring(0,3);
        var default_code = '';
        var sbstr= getSelectedlang.substring(0,3);
        if(sbstr=="nb_"){
            default_code ="no";
        }
        else if(sbstr=="azb"){
            default_code ="azb";   
        }
        else{
          default_code =   getSelectedlang.substring(0,2);
        }
        return default_code;
    }
}(window, jQuery);