//
//  Beacon.h
//  Hello
//
//  Created by svilen radichkov on 17/10/14.
//
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
@interface Beacon : CDVPlugin<CLLocationManagerDelegate>
@property (strong, nonatomic)CLLocationManager *locationManager;
@property (strong, nonatomic)CLBeaconRegion *beaconRegion;
@property (nonatomic, strong) NSString* callback;
- (void)initBeacon:(CDVInvokedUrlCommand*)command;
- (void)pluginRespond:(CDVInvokedUrlCommand*)command keepCallback:(BOOL)keep callback:(int)callback;
- (void)pluginRespondwithData:(NSDictionary*)dic toCallback:(NSString*)callback;
- (void) pluginInitialize;
- (void) didFinishLaunchingWithOptions:(NSNotification*)notification;
- (void) didReceiveLocalNotification:(NSNotification*)localNotification;
- (void) requestAuthorization;

@end