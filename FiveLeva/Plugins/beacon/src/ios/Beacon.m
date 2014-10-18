//
//  Beacon.m
//  Hello
//
//  Created by svilen radichkov on 17/10/14.
//
//

#import <Cordova/CDV.h>
#import "Beacon.h"
@implementation Beacon

- (void)pluginRespond:(CDVInvokedUrlCommand*)command keepCallback:(BOOL)keep callback: (int)callback{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    if (keep){
        [pluginResult setKeepCallbackAsBool:true];
        switch(callback){
            case 1: self.callback = command.callbackId;break;
                // case 2: self.scanCallback = command.callbackId;break;
        }
        
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}


- (void) requestAuthorization{
    
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 80000
    // Being compiled with a Base SDK of iOS 8 or later
    // Now do a runtime check to be sure the method is supported
    if ([self.locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
        [self.locationManager requestAlwaysAuthorization];
    }
    if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
        [self.locationManager requestWhenInUseAuthorization];
    }
#else
    // Being compiled with a Base SDK of iOS 7.x or earlier
    // No such method - do something else as needed
#endif
    
}
-(void)pluginRespondwithData:(NSDictionary*)dic toCallback:(NSString*)callback{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dic];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callback];
    
}
-(void)locationManager: manager didEnterRegion:(CLRegion *)region{
    
    UILocalNotification *localNotif = [[UILocalNotification alloc] init];
    localNotif.fireDate = [NSDate dateWithTimeIntervalSinceNow:1];
    localNotif.alertBody=@"There are discounts near you!";
    localNotif.timeZone=[NSTimeZone defaultTimeZone];
    localNotif.soundName=UILocalNotificationDefaultSoundName;
    NSDictionary * dic = [[NSDictionary alloc]initWithObjectsAndKeys: [NSNumber numberWithInt:1], @"storeNumber", nil];
       localNotif.userInfo = dic;
    [[UIApplication sharedApplication] scheduleLocalNotification:localNotif];
    NSLog(@"Enterign region");
    
}
- (void) pluginInitialize
{
    NSNotificationCenter* notificationCenter = [NSNotificationCenter
                                                defaultCenter];
    
    // eventQueue = [[NSMutableArray alloc] init];
    
    [notificationCenter addObserver:self
                           selector:@selector(didReceiveLocalNotification:)
                               name:CDVLocalNotification
                             object:nil];
    
    [notificationCenter addObserver:self
                           selector:@selector(didFinishLaunchingWithOptions:)
                               name:UIApplicationDidFinishLaunchingNotification
                             object:nil];
    [self requestAuthorization];
    /*if ([self.locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) { [self.locationManager requestAlwaysAuthorization]; }
     if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
     [[UIApplication sharedApplication ]registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:nil]];
     }*/
    
}
- (void) didReceiveLocalNotification:(NSNotification*)localNotification
{
    NSLog(@"Got local notification");
    UILocalNotification* notification = [localNotification object];
    
    NSDictionary* userInfo = notification.userInfo;

    NSNumber* storeNumber = [userInfo objectForKey:@"storeNumber"];
    NSLog(@"Got store number %i", storeNumber.intValue);
    
}
- (void) didFinishLaunchingWithOptions:(NSNotification*)notification
{
    NSLog(@"Starting from notification");
    NSDictionary* launchOptions = [notification userInfo];
    
    UILocalNotification* localNotification = [launchOptions objectForKey:
                                              UIApplicationLaunchOptionsLocalNotificationKey];
    
    if (localNotification) {
        [self didReceiveLocalNotification:
         [NSNotification notificationWithName:CDVLocalNotification
                                       object:localNotification]];
    }
}
-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error{
    NSDictionary * dic = [[NSDictionary alloc]initWithObjectsAndKeys: error.description, @"error", nil];
    [self pluginRespondwithData:dic toCallback:self.callback];
    
}
-(void)locationManager:(CLLocationManager *)manager didExitRegion:(CLRegion *)region{
    NSLog(@"Exiting");
//    [[UIApplication sharedApplication] scheduledLocalNotifications];
    //NSArray* notifications = [[UIApplication sharedApplication]
                   //           scheduledLocalNotifications];
    //for (UILocalNotification* notification in notifications) {
        [[UIApplication sharedApplication] cancelAllLocalNotifications];
    //}
}

-(void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status{
    NSString * lbl;
    if (![CLLocationManager locationServicesEnabled]) {
        lbl = @"Couldn't turn on ranging: Location services are not enabled.";
    }
    
    if ([CLLocationManager authorizationStatus] != kCLAuthorizationStatusAuthorized) {
        lbl = @"Couldn't turn on monitoring: Location services not authorised.";
    }
    NSDictionary * dic = [[NSDictionary alloc]initWithObjectsAndKeys: lbl, @"error", nil];
    [self pluginRespondwithData:dic toCallback:self.callback];
}
-(void)locationManager:(CLLocationManager *)manager didStartMonitoringForRegion:(CLRegion *)region{
    NSDictionary * dic = [[NSDictionary alloc]initWithObjectsAndKeys: @"yes", @"scanning", nil];
    [self pluginRespondwithData:dic toCallback:self.callback];
}
- (void)initBeacon:(CDVInvokedUrlCommand*)command
{
    
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    self.beaconRegion = [[CLBeaconRegion alloc]
                         initWithProximityUUID: [[NSUUID alloc]initWithUUIDString:@"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"]
                         identifier:@"eu.offeryfly.region1"];
    [self.locationManager startMonitoringForRegion:self.beaconRegion];
    [self pluginRespond:command keepCallback:true callback:1];
    
}
@end