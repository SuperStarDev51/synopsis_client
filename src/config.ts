interface Config {
  readonly ipServer: string
  readonly iconsPath: string
}

  export const config: Config = {
    // "ipServer": "http://localhost:3000",
    // "ipServer": "http://imgnserverdev-env.eba-nedy53v3.us-east-1.elasticbeanstalk.com",
    "ipServer": "http://synopsis-env.eba-jer6apbt.us-east-2.elasticbeanstalk.com",
    //"ipServer": "https://api.imgn.co",
    "iconsPath": '../../../assets/icons/'
  }
