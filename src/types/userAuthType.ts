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
