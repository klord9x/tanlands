(function ($) {
    /* Shortcode Builder Popup */
    $('#wpforms-builder').on('click', '.useyourdrive.open-shortcode-builder', function () {
        var input_field = $(this).prev();
        var shortcode = input_field.val().replace('[useyourdrive ', '').replace('"]', '');

        window.addEventListener("message", callback_handler)
        openShortcodeBuilder(shortcode)

        $('.thickbox_data').removeClass('thickbox_data');
        input_field.addClass('thickbox_data');
    });

    function callback_handler(event) {

        if (event.origin !== window.parent.location.origin) {
            return;
        }

        if (typeof event.data !== 'object' || event.data === null || typeof event.data.action === 'undefined' || typeof event.data.shortcode === 'undefined') {
            return;
        }

        if (event.data.action !== 'wpcp-shortcode') {
            return;
        }

        if (event.data.slug !== 'useyourdrive') {
            return;
        }

        $('.thickbox_data').val(event.data.shortcode).trigger('keyup change');
        window.modal_action.close();
        $('#useyourdrive-modal-action').remove();

        window.removeEventListener("message", callback_handler)

    }

    function openShortcodeBuilder(shortcode) {

        if ($('#useyourdrive-modal-action').length > 0) {
            window.modal_action.close();
            $('#useyourdrive-modal-action').remove();
        }

        /* Build the  Dialog */
        var modalbuttons = '';
        var modalheader = $('<a tabindex="0" class="close-button" title="" onclick="modal_action.close();"><i class="eva eva-close eva-lg" aria-hidden="true"></i></a></div>');
        var modalbody = $('<div class="useyourdrive-modal-body" tabindex="0" style="display:none;padding:0!important;"></div>');
        var modaldialog = $('<div id="useyourdrive-modal-action" class="UseyourDrive useyourdrive-modal useyourdrive-modal80 light"><div class="modal-dialog"><div class="modal-content" style="padding:40px 0 0 0!important"><div class="loading"><div class="loader-beat"></div></div></div></div></div>');

        $('body').append(modaldialog);

        var query = encodeURIComponent(shortcode).split('%3D%22').join('=').split('%22%20').join('&');

        var $iframe_template = $("<iframe src='" + window.ajaxurl + "?action=useyourdrive-getpopup&type=shortcodebuilder&asuploadbox=1&" + query + "' width='100%' height='600' tabindex='-1' frameborder='0'></iframe>");
        var $iframe = $iframe_template.appendTo(modalbody);

        $('#useyourdrive-modal-action .modal-content').append(modalheader, modalbody);

        $iframe.on('load', function () {
            $('.useyourdrive-modal-body').fadeIn();
            $('.useyourdrive-modal-footer').fadeIn();
            $('.modal-content .loading:first').fadeOut();
        });

        /* Open the Dialog */
        var modal_action = new RModal(document.getElementById('useyourdrive-modal-action'), {
            bodyClass: 'rmodal-open',
            dialogOpenClass: 'animated slideInDown',
            dialogCloseClass: 'animated slideOutUp',
            escapeClose: true,
            afterClose() {
                window.removeEventListener("message", callback_handler)
            },
        });
        document.addEventListener('keydown', function (ev) {
            modal_action.keydown(ev);
        }, false);
        modal_action.open();
        window.modal_action = modal_action;
    }

})(jQuery);