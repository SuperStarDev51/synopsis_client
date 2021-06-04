interface Config {
  readonly ipServer: string
  readonly iconsPath: string
}

  export const config: Config = {
    "ipServer": "http://localhost:3000",
    // "ipServer": "http://synopsis-env.eba-jer6apbt.us-east-2.elasticbeanstalk.com",
    "iconsPath": '../../../assets/icons/'
  }
