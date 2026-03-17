export interface LoginPayload {
  username: string;
  password: string;
}

export interface OtpPayload {
  username: string;
  otp: number;         
}

export interface PreAuthResponse{
    message:string
    bffPublicKey:string
}
export type LoginResponse=void

export interface KraResponse {
    kraMessage: string
    kraUrl: string[]
}

export interface JwtTokens{
    accessToken:string
    refreshToken:string
}

export interface ValidateOtpResponse{
    firstName:string
    lastName:string
    username:string
    userId:number
    accountId:string
    emailId:string
    phoneNumber:number
    enabledExchanges:string[]
    enabledProductCode:string[]
    brokerName:string
    branchId:string
    userType:string
    jwtTokens:JwtTokens
    loginMessage:string
    discloseUrl:string
    gttEnabled:boolean
    kraResponse:KraResponse
    sipEnabled:boolean
    marketWatchCount:string
    userSessionId:number
    isPasswordExpired:boolean
    indexEnabledExchanges:string[]|null
}
export type LoginStep = 'idle' | 'credentials' | 'otp' |'forgot-credentials'| 'set-password' | 'success';
