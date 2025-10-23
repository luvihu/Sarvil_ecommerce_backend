
export interface ICreatePlan {
  name: string;
  description: string;
  deliverables: string[];
  priceRange: string;
};

export interface IPlan extends ICreatePlan {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: { id: string; name: string };
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  category: string;
  isVisible?: boolean;
  images?: IImage[];
  videos?: IVideo[];
  createdBy?: { id: string; name: string };
 
};
export interface ICreateProject {
  title: string;
  description: string;
  category: string;
  isVisible?: boolean;
 }; 

export interface IImage {
  id?: string;
  url: string;
  publicId: string;
  filename: string;
  mimetype: string;
  width?: number;
  height?: number;
  isActive: boolean;
  createdAt?: Date;
  projectId?: string;
}

export interface ICreateImage {
  url: string;
  publicId: string;
  filename: string;
  mimetype: string;
  width?: number;
  height?: number;
 }

 export interface ICreateVideo {
  url: string;
  publicId: string;
  filename: string;
  mimetype: string;
  duration?: number;
  size?: number;
};

export interface IVideo extends ICreateVideo {
 id?: string;
 isActive: boolean;
 createdAt?: Date;
 projectId?: string;
}

 export interface IRegisterUser {
  name: string;
  email: string;
  password:string;
  }

  export interface ICreateInquiry {
    name: string;
    email: string;
    phone: string;
    message: string;
    selectedPlan: string;
  }
  export interface IInquiry extends ICreateInquiry {
    id: string;
    responded: boolean;
    createdAt: Date;
  }
