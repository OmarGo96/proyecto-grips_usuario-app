export interface DocDataTransfer
{
    position?: number;
    success?: boolean;
    file_id?: number;
    doc_type?: string;
    model?: string;
    model_id?: string;
    //model_id_value?: string;
    mime_type?: string;
    file?: File | string;
    etiqueta?: string;

    url?: string;
    uploading?: boolean;
    fileName?: string;
    fileErrors?: string;
}
