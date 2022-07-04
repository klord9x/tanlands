(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
    const {__} = wp.i18n;
    const {Component, Fragment} = wp.element;
    const {registerBlockType} = wpBlocks;
    const {BlockControls, BlockAlignmentToolbar} = wpEditor;
    const {Modal, FocusableIframe, IconButton, Toolbar} = wp.components;
    const $ = jQuery;

    /*const el = wp.element.createElement;*/
    class WpmfOnedrive extends Component {
        constructor() {
            super(...arguments);
            this.state = {
                isOpen: false
            };

            this.openModal = this.openModal.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.addEventListener = this.addEventListener.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
        }

        openModal() {
            if (!this.state.isOpen) {
                this.setState({isOpen: true});
            }
        }

        closeModal() {
            if (this.state.isOpen) {
                this.setState({isOpen: false});
            }
        }

        addLoading() {
            const {clientId} = this.props;
            if ($('#block-' + clientId + ' [data-block="'+ clientId +'"] img').length) {
                if (!$('#block-' + clientId + ' .wpmf_loading_process').length) {
                    $('#block-' + clientId).prepend(`<label class="wpmf_loading_process" style=" position: absolute; left: 45%; ">${wpmfodvbusinessblocks.l18n.loading}</label>`);
                }

                $('#block-' + clientId + ' [data-block="'+ clientId +'"] img').on('load', function () {
                    $('#block-' + clientId + ' .wpmf_loading_process').remove();
                });
            }
        }

        addEventListener(e) {
            if (!e.data.hasfiles) {
                return;
            }

            if (e.data.type !== 'wpmfonedriveinsert') {
                return;
            }

            if (e.data.idblock !== this.props.clientId) {
                return;
            }

            this.setState({
                isOpen: false
            });

            const {setAttributes} = this.props;
            setAttributes({
                html: e.data.html,
                hasfiles: e.data.hasfiles
            });

            this.addLoading();
        }

        componentDidMount() {
            this.addLoading();
            window.addEventListener("message", this.addEventListener, false);
        }

        render() {
            const {attributes, setAttributes} = this.props;
            const {
                align,
                html,
                hasfiles,
                cover
            } = attributes;
            const renderHTML = (rawHTML: string) => React.createElement("div", {dangerouslySetInnerHTML: {__html: rawHTML}});
            return (
                <Fragment>
                    {
                        typeof cover !== "undefined" && <div className="wpmf-cover"><img src={cover} /></div>
                    }

                    {typeof cover === "undefined" && hasfiles && (
                        <BlockControls>
                            <BlockAlignmentToolbar value={align} onChange={(align) => setAttributes({align: align})}/>

                            <Toolbar>
                                <IconButton
                                    className="components-toolbar__control"
                                    label={wpmfodvblocks.l18n.remove}
                                    icon={'no'}
                                    onClick={() => setAttributes({hasfiles: false, html: ''})}
                                />
                            </Toolbar>
                        </BlockControls>
                    )}

                    {(typeof cover === "undefined" && hasfiles) &&
                    renderHTML(html)
                    }
                    {typeof cover === "undefined" && !hasfiles &&
                    <button className="components-button is-button is-default is-primary is-large aligncenter"
                            onClick={this.openModal}>{wpmfodvblocks.l18n.btnopen}</button>}
                </Fragment>
            );
        }
    }

    const wpmfOnedriveBlockIcon = (
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="20" x="0px" y="0px"
             viewBox="0 0 512 512">
            <path fill={'#007CAA'} d="M191.309,122.22c-6.485-1.276-13.081-1.92-19.709-1.92c-51.554,0-94.297,38.443-101.066,88.169
                C30.558,215.188,0,250.043,0,291.9c0,45.099,35.474,82.063,79.983,84.469C78.039,368.393,77,360.066,77,351.5
                c0-24.023,8.352-47.523,23.516-66.171c9.965-12.254,22.582-22.082,36.705-28.775c8.955-60.228,57.84-107.594,118.78-114.246
                l30-27.441l-30-27.441C231.389,91.888,208.801,103.97,191.309,122.22z"/>
            <path fill={'#007CAA'} d="M165.75,276.5c0,0.589,0.005,1.179,0.015,1.77C132.188,285.708,107,315.718,107,351.5
                c0,41.355,33.645,75,75,75h74l60-126.979l-60-126.979C205.062,179.734,165.75,223.609,165.75,276.5z"/>
            <path fill={'#015E82'} d="M450.959,277.802C444.343,234.653,406.971,201.5,362,201.5c-5.471,0-10.917,0.497-16.281,1.483
                c-19.695-20.116-46.521-31.483-74.969-31.483c-5.006,0-9.929,0.36-14.75,1.041V426.5h181c41.355,0,75-33.645,75-75
                C512,314.913,485.669,284.361,450.959,277.802z"/>
            <path fill={'#015E82'} d="M355.844,171.659c2.052-0.105,4.105-0.159,6.156-0.159c10.62,0,21.111,1.417,31.219,4.147
                C380.139,123.906,333.198,85.5,277.45,85.5c-7.267,0-14.44,0.655-21.45,1.926v54.881c4.846-0.529,9.766-0.808,14.75-0.808
                C302.191,141.5,331.89,152.114,355.844,171.659z"/>
        </svg>
    );
    registerBlockType('wpmf/block-onedrive-file', {
        title: wpmfodvblocks.l18n.onedrive_drive,
        icon: wpmfOnedriveBlockIcon,
        category: 'wp-media-folder',
        keywords: [
            __('onedrive', 'wpmfAddon'),
            __('file', 'wpmfAddon'),
            __('attachment', 'wpmfAddon')
        ],
        example: {
            attributes: {
                cover: wpmfodvblocks.vars.block_cover
            }
        },
        attributes: {
            hasfiles: {
                type: 'string',
                default: false
            },
            html: {
                type: 'string',
                default: ''
            },
            align: {
                type: 'string',
                default: 'center'
            },
            cover: {
                type: 'string',
                source: 'attribute',
                selector: 'img',
                attribute: 'src',
            }
        },
        edit: WpmfOnedrive,
        save: ({attributes}) => {

            const {
                align,
                html,
                hasfiles,
            } = attributes;

            const renderHTML = (rawHTML: string) => React.createElement("div", {dangerouslySetInnerHTML: {__html: rawHTML}});
            return (
                (hasfiles) &&
                <div className={`align${align}`}>
                    {renderHTML(html)}
                </div>
            );
        },
        getEditWrapperProps(attributes) {
            const {align} = attributes;
            const props = {'data-resized': true};

            if ('left' === align || 'right' === align || 'center' === align) {
                props['data-align'] = align;
            }

            return props;
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components);