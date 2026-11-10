export interface CreateBookmarkDto{
    url:string
    title:string
    description?:string
    favicon?:string
    previewImage?:string
    isFavorite?:boolean
}

export interface UpdateBookmarkDto {
    title?: string;        
    description?: string;  
    url?: string;          
    favicon?: string;      
    previewImage?: string; 
    isFavorite?: boolean;  
    isArchived?: boolean;  
}