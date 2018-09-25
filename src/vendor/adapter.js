/*! adapterjs - v0.15.0 - 2017-09-05 */
var AdapterJS = AdapterJS || {};
(AdapterJS.options = AdapterJS.options || {}),
  (AdapterJS.options.getAllCams = !!AdapterJS.options.getAllCams),
  (AdapterJS.options.hidePluginInstallPrompt = !!AdapterJS.options
    .hidePluginInstallPrompt),
  (AdapterJS.options.forceSafariPlugin = !!AdapterJS.options.forceSafariPlugin),
  (AdapterJS.VERSION = '0.15.0'),
  (AdapterJS.onwebrtcready =
    AdapterJS.onwebrtcready || function(isUsingPlugin) {}),
  (AdapterJS._onwebrtcreadies = []),
  (AdapterJS.webRTCReady = function(baseCallback) {
    if ('function' != typeof baseCallback)
      throw new Error('Callback provided is not a function');
    var callback = function() {
      'function' == typeof window.require &&
        'function' == typeof AdapterJS._defineMediaSourcePolyfill &&
        AdapterJS._defineMediaSourcePolyfill(),
        baseCallback(null !== AdapterJS.WebRTCPlugin.plugin);
    };
    !0 === AdapterJS.onwebrtcreadyDone
      ? callback()
      : AdapterJS._onwebrtcreadies.push(callback);
  }),
  (AdapterJS.WebRTCPlugin = AdapterJS.WebRTCPlugin || {}),
  (AdapterJS.WebRTCPlugin.pluginInfo = AdapterJS.WebRTCPlugin.pluginInfo || {
    prefix: 'Tem',
    plugName: 'TemWebRTCPlugin',
    pluginId: 'plugin0',
    type: 'application/x-temwebrtcplugin',
    onload: '__TemWebRTCReady0',
    portalLink: 'https://skylink.io/plugin/',
    downloadLink: null,
    companyName: 'Temasys',
    downloadLinks: {
      mac: 'https://bit.ly/webrtcpluginpkg',
      win: 'https://bit.ly/webrtcpluginmsi'
    }
  }),
  void 0 !== AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks &&
    null !== AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks &&
    (navigator.platform.match(/^Mac/i)
      ? (AdapterJS.WebRTCPlugin.pluginInfo.downloadLink =
          AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.mac)
      : navigator.platform.match(/^Win/i) &&
        (AdapterJS.WebRTCPlugin.pluginInfo.downloadLink =
          AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.win)),
  (AdapterJS.WebRTCPlugin.TAGS = {
    NONE: 'none',
    AUDIO: 'audio',
    VIDEO: 'video'
  }),
  (AdapterJS.WebRTCPlugin.pageId = Math.random()
    .toString(36)
    .slice(2)),
  (AdapterJS.WebRTCPlugin.plugin = null),
  (AdapterJS.WebRTCPlugin.setLogLevel = null),
  (AdapterJS.WebRTCPlugin.defineWebRTCInterface = null),
  (AdapterJS.WebRTCPlugin.isPluginInstalled = null),
  (AdapterJS.WebRTCPlugin.pluginInjectionInterval = null),
  (AdapterJS.WebRTCPlugin.injectPlugin = null),
  (AdapterJS.WebRTCPlugin.PLUGIN_STATES = {
    NONE: 0,
    INITIALIZING: 1,
    INJECTING: 2,
    INJECTED: 3,
    READY: 4
  }),
  (AdapterJS.WebRTCPlugin.pluginState =
    AdapterJS.WebRTCPlugin.PLUGIN_STATES.NONE),
  (AdapterJS.onwebrtcreadyDone = !1),
  (AdapterJS.WebRTCPlugin.PLUGIN_LOG_LEVELS = {
    NONE: 'NONE',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    INFO: 'INFO',
    VERBOSE: 'VERBOSE',
    SENSITIVE: 'SENSITIVE'
  }),
  (AdapterJS.WebRTCPlugin.WaitForPluginReady = null),
  (AdapterJS.WebRTCPlugin.callWhenPluginReady = null),
  (__TemWebRTCReady0 = function() {
    'interactive' === document.readyState || 'complete' === document.readyState
      ? ((AdapterJS.WebRTCPlugin.pluginState =
          AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY),
        AdapterJS.maybeThroughWebRTCReady())
      : setTimeout(__TemWebRTCReady0, 100);
  }),
  (AdapterJS.maybeThroughWebRTCReady = function() {
    AdapterJS.onwebrtcreadyDone ||
      ((AdapterJS.onwebrtcreadyDone = !0),
      AdapterJS._onwebrtcreadies.length
        ? AdapterJS._onwebrtcreadies.forEach(function(callback) {
            'function' == typeof callback &&
              callback(null !== AdapterJS.WebRTCPlugin.plugin);
          })
        : 'function' == typeof AdapterJS.onwebrtcready &&
          AdapterJS.onwebrtcready(null !== AdapterJS.WebRTCPlugin.plugin));
  }),
  (AdapterJS.TEXT = {
    PLUGIN: {
      REQUIRE_INSTALLATION:
        'This website requires you to install a WebRTC-enabling plugin to work on this browser.',
      NOT_SUPPORTED: 'Your browser does not support WebRTC.',
      BUTTON: 'Install Now'
    },
    REFRESH: { REQUIRE_REFRESH: 'Please refresh page', BUTTON: 'Refresh Page' }
  }),
  (AdapterJS._iceConnectionStates = {
    starting: 'starting',
    checking: 'checking',
    connected: 'connected',
    completed: 'connected',
    done: 'completed',
    disconnected: 'disconnected',
    failed: 'failed',
    closed: 'closed'
  }),
  (AdapterJS._iceConnectionFiredStates = []),
  (AdapterJS.isDefined = null),
  (AdapterJS.parseWebrtcDetectedBrowser = function() {
    var hasMatch = null;
    if (
      (window.opr && opr.addons) ||
      window.opera ||
      navigator.userAgent.indexOf(' OPR/') >= 0
    )
      (hasMatch = navigator.userAgent.match(/OPR\/(\d+)/i) || []),
        (webrtcDetectedBrowser = 'opera'),
        (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)),
        (webrtcMinimumVersion = 26),
        (webrtcDetectedType = 'webkit'),
        (webrtcDetectedDCSupport = 'SCTP');
    else if (navigator.userAgent.match(/Bowser\/[0-9.]*/g)) {
      hasMatch = navigator.userAgent.match(/Bowser\/[0-9.]*/g) || [];
      var chromiumVersion = parseInt(
        (navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [])[2] ||
          '0',
        10
      );
      (webrtcDetectedBrowser = 'bowser'),
        (webrtcDetectedVersion = parseFloat(
          (hasMatch[0] || '0/0').split('/')[1],
          10
        )),
        (webrtcMinimumVersion = 0),
        (webrtcDetectedType = 'webkit'),
        (webrtcDetectedDCSupport = chromiumVersion > 30 ? 'SCTP' : 'RTP');
    } else if (navigator.userAgent.indexOf('OPiOS') > 0)
      (hasMatch = navigator.userAgent.match(/OPiOS\/([0-9]+)\./)),
        (webrtcDetectedBrowser = 'opera'),
        (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)),
        (webrtcMinimumVersion = 0),
        (webrtcDetectedType = null),
        (webrtcDetectedDCSupport = null);
    else if (navigator.userAgent.indexOf('CriOS') > 0)
      (hasMatch = navigator.userAgent.match(/CriOS\/([0-9]+)\./) || []),
        (webrtcDetectedBrowser = 'chrome'),
        (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)),
        (webrtcMinimumVersion = 0),
        (webrtcDetectedType = null),
        (webrtcDetectedDCSupport = null);
    else if (navigator.userAgent.indexOf('FxiOS') > 0)
      (hasMatch = navigator.userAgent.match(/FxiOS\/([0-9]+)\./) || []),
        (webrtcDetectedBrowser = 'firefox'),
        (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)),
        (webrtcMinimumVersion = 0),
        (webrtcDetectedType = null),
        (webrtcDetectedDCSupport = null);
    else if (document.documentMode)
      (hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || []),
        (webrtcDetectedBrowser = 'IE'),
        (webrtcDetectedVersion = parseInt(hasMatch[1], 10)),
        (webrtcMinimumVersion = 9),
        (webrtcDetectedType = 'plugin'),
        (webrtcDetectedDCSupport = 'SCTP'),
        webrtcDetectedVersion ||
          ((hasMatch = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || []),
          (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)));
    else if (
      window.StyleMedia ||
      navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)
    )
      (hasMatch = navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) || []),
        (webrtcDetectedBrowser = 'edge'),
        (webrtcDetectedVersion = parseFloat(
          (hasMatch[0] || '0/0').split('/')[1],
          10
        )),
        (webrtcMinimumVersion = 13.10547),
        (webrtcDetectedType = 'ms'),
        (webrtcDetectedDCSupport = null);
    else if (
      'undefined' != typeof InstallTrigger ||
      navigator.userAgent.indexOf('irefox') > 0
    )
      (hasMatch = navigator.userAgent.match(/Firefox\/([0-9]+)\./) || []),
        (webrtcDetectedBrowser = 'firefox'),
        (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)),
        (webrtcMinimumVersion = 33),
        (webrtcDetectedType = 'moz'),
        (webrtcDetectedDCSupport = 'SCTP');
    else if (
      (window.chrome && window.chrome.webstore) ||
      navigator.userAgent.indexOf('Chrom') > 0
    )
      (hasMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || []),
        (webrtcDetectedBrowser = 'chrome'),
        (webrtcDetectedVersion = parseInt(hasMatch[2] || '0', 10)),
        (webrtcMinimumVersion = 38),
        (webrtcDetectedType = 'webkit'),
        (webrtcDetectedDCSupport = webrtcDetectedVersion > 30 ? 'SCTP' : 'RTP');
    else if (
      /constructor/i.test(window.HTMLElement) ||
      (function(p) {
        return '[object SafariRemoteNotification]' === p.toString();
      })(!window.safari || safari.pushNotification) ||
      navigator.userAgent.match(/AppleWebKit\/(\d+)\./) ||
      navigator.userAgent.match(/Version\/(\d+).(\d+)/)
    ) {
      (hasMatch = navigator.userAgent.match(/version\/(\d+)/i) || []),
        (AppleWebKitBuild =
          navigator.userAgent.match(/AppleWebKit\/(\d+)/i) || []);
      var isMobile = navigator.userAgent.match(/(iPhone|iPad)/gi),
        hasNativeImpl =
          AppleWebKitBuild.length >= 1 && AppleWebKitBuild[1] >= 604;
      (webrtcDetectedBrowser = 'safari'),
        (webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10)),
        (webrtcMinimumVersion = 7),
        (webrtcDetectedType = isMobile
          ? hasNativeImpl
            ? 'AppleWebKit'
            : null
          : hasNativeImpl && !AdapterJS.options.forceSafariPlugin
            ? 'AppleWebKit'
            : 'plugin'),
        (webrtcDetectedDCSupport = 'SCTP');
    }
    (AdapterJS.webrtcDetectedBrowser = window.webrtcDetectedBrowser = webrtcDetectedBrowser),
      (AdapterJS.webrtcDetectedVersion = window.webrtcDetectedVersion = webrtcDetectedVersion),
      (AdapterJS.webrtcMinimumVersion = window.webrtcMinimumVersion = webrtcMinimumVersion),
      (AdapterJS.webrtcDetectedType = window.webrtcDetectedType = webrtcDetectedType),
      (AdapterJS.webrtcDetectedDCSupport = window.webrtcDetectedDCSupport = webrtcDetectedDCSupport);
  }),
  (AdapterJS.addEvent = function(elem, evnt, func) {
    elem.addEventListener
      ? elem.addEventListener(evnt, func, !1)
      : elem.attachEvent
        ? elem.attachEvent('on' + evnt, func)
        : (elem[evnt] = func);
  }),
  (AdapterJS.renderNotificationBar = function(
    message,
    buttonText,
    buttonCallback
  ) {
    if (
      'interactive' === document.readyState ||
      'complete' === document.readyState
    ) {
      var w = window,
        i = document.createElement('iframe');
      (i.name = 'adapterjs-alert'),
        (i.style.position = 'fixed'),
        (i.style.top = '-41px'),
        (i.style.left = 0),
        (i.style.right = 0),
        (i.style.width = '100%'),
        (i.style.height = '40px'),
        (i.style.backgroundColor = '#ffffe1'),
        (i.style.border = 'none'),
        (i.style.borderBottom = '1px solid #888888'),
        (i.style.zIndex = '9999999'),
        'string' == typeof i.style.webkitTransition
          ? (i.style.webkitTransition = 'all .5s ease-out')
          : 'string' == typeof i.style.transition &&
            (i.style.transition = 'all .5s ease-out'),
        document.body.appendChild(i);
      var c = i.contentWindow
        ? i.contentWindow
        : i.contentDocument.document
          ? i.contentDocument.document
          : i.contentDocument;
      c.document.open(),
        c.document.write(
          '<span style="display: inline-block; font-family: Helvetica, Arial,sans-serif; font-size: .9rem; padding: 4px; vertical-align: middle; cursor: default;">' +
            message +
            '</span>'
        ),
        buttonText && 'function' == typeof buttonCallback
          ? (c.document.write(
              '<button id="okay">' +
                buttonText +
                '</button><button id="cancel">Cancel</button>'
            ),
            c.document.close(),
            AdapterJS.addEvent(
              c.document.getElementById('okay'),
              'click',
              function(e) {
                e.preventDefault();
                try {
                  e.cancelBubble = !0;
                } catch (error) {}
                buttonCallback(e);
              }
            ),
            AdapterJS.addEvent(
              c.document.getElementById('cancel'),
              'click',
              function(e) {
                w.document.body.removeChild(i);
              }
            ))
          : c.document.close(),
        setTimeout(function() {
          'string' == typeof i.style.webkitTransform
            ? (i.style.webkitTransform = 'translateY(40px)')
            : 'string' == typeof i.style.transform
              ? (i.style.transform = 'translateY(40px)')
              : (i.style.top = '0px');
        }, 300);
    }
  }),
  (webrtcDetectedType = null),
  (checkMediaDataChannelSettings = function(
    peerBrowserAgent,
    peerBrowserVersion,
    callback,
    constraints
  ) {
    if ('function' == typeof callback) {
      var beOfferer = !0,
        isLocalFirefox = 'firefox' === AdapterJS.webrtcDetectedBrowser,
        isLocalFirefoxInterop =
          'moz' === AdapterJS.webrtcDetectedType &&
          AdapterJS.webrtcDetectedVersion > 30,
        isPeerFirefox = 'firefox' === peerBrowserAgent;
      if ((isLocalFirefox && isPeerFirefox) || isLocalFirefoxInterop)
        try {
          delete constraints.mandatory.MozDontOfferDataChannel;
        } catch (error) {}
      else
        isLocalFirefox &&
          !isPeerFirefox &&
          (constraints.mandatory.MozDontOfferDataChannel = !0);
      if (!isLocalFirefox)
        for (var prop in constraints.mandatory)
          constraints.mandatory.hasOwnProperty(prop) &&
            -1 !== prop.indexOf('Moz') &&
            delete constraints.mandatory[prop];
      !isLocalFirefox ||
        isPeerFirefox ||
        isLocalFirefoxInterop ||
        (beOfferer = !1),
        callback(beOfferer, constraints);
    }
  }),
  (checkIceConnectionState = function(peerId, iceConnectionState, callback) {
    'function' == typeof callback &&
      ((peerId = peerId || 'peer'),
      (AdapterJS._iceConnectionFiredStates[peerId] &&
        iceConnectionState !== AdapterJS._iceConnectionStates.disconnected &&
        iceConnectionState !== AdapterJS._iceConnectionStates.failed &&
        iceConnectionState !== AdapterJS._iceConnectionStates.closed) ||
        (AdapterJS._iceConnectionFiredStates[peerId] = []),
      (iceConnectionState = AdapterJS._iceConnectionStates[iceConnectionState]),
      AdapterJS._iceConnectionFiredStates[peerId].indexOf(iceConnectionState) <
        0 &&
        (AdapterJS._iceConnectionFiredStates[peerId].push(iceConnectionState),
        iceConnectionState === AdapterJS._iceConnectionStates.connected &&
          setTimeout(function() {
            AdapterJS._iceConnectionFiredStates[peerId].push(
              AdapterJS._iceConnectionStates.done
            ),
              callback(AdapterJS._iceConnectionStates.done);
          }, 1e3),
        callback(iceConnectionState)));
  }),
  (createIceServer = null),
  (createIceServers = null),
  (MediaStream = 'function' == typeof MediaStream ? MediaStream : null),
  (RTCPeerConnection =
    'function' == typeof RTCPeerConnection ? RTCPeerConnection : null),
  (RTCSessionDescription =
    'function' == typeof RTCSessionDescription ? RTCSessionDescription : null),
  (RTCIceCandidate =
    'function' == typeof RTCIceCandidate ? RTCIceCandidate : null),
  (getUserMedia = null),
  (attachMediaStream = null),
  (reattachMediaStream = null),
  (webrtcDetectedBrowser = null),
  (webrtcDetectedVersion = null),
  (webrtcMinimumVersion = null),
  (webrtcDetectedDCSupport = null),
  (requestUserMedia = null),
  AdapterJS.parseWebrtcDetectedBrowser(),
  ['webkit', 'moz', 'ms', 'AppleWebKit'].indexOf(AdapterJS.webrtcDetectedType) >
  -1
    ? (navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) &&
        window.RTCPeerConnection &&
        (window.msRTCPeerConnection = window.RTCPeerConnection),
      (function(f) {
        if ('object' == typeof exports && 'undefined' != typeof module)
          module.exports = f();
        else if ('function' == typeof define && define.amd) define([], f);
        else {
          var g;
          (g =
            'undefined' != typeof window
              ? window
              : 'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                  ? self
                  : this),
            (g.adapter = f());
        }
      })(function() {
        return (function e(t, n, r) {
          function s(o, u) {
            if (!n[o]) {
              if (!t[o]) {
                var a = 'function' == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw ((f.code = 'MODULE_NOT_FOUND'), f);
              }
              var l = (n[o] = { exports: {} });
              t[o][0].call(
                l.exports,
                function(e) {
                  var n = t[o][1][e];
                  return s(n || e);
                },
                l,
                l.exports,
                e,
                t,
                n,
                r
              );
            }
            return n[o].exports;
          }
          for (
            var i = 'function' == typeof require && require, o = 0;
            o < r.length;
            o++
          )
            s(r[o]);
          return s;
        })(
          {
            1: [
              function(requirecopy, module, exports) {
                'use strict';
                function writeMediaSection(transceiver, caps, type, stream) {
                  var sdp = SDPUtils.writeRtpDescription(
                    transceiver.kind,
                    caps
                  );
                  if (
                    ((sdp += SDPUtils.writeIceParameters(
                      transceiver.iceGatherer.getLocalParameters()
                    )),
                    (sdp += SDPUtils.writeDtlsParameters(
                      transceiver.dtlsTransport.getLocalParameters(),
                      'offer' === type ? 'actpass' : 'active'
                    )),
                    (sdp += 'a=mid:' + transceiver.mid + '\r\n'),
                    transceiver.direction
                      ? (sdp += 'a=' + transceiver.direction + '\r\n')
                      : transceiver.rtpSender && transceiver.rtpReceiver
                        ? (sdp += 'a=sendrecv\r\n')
                        : transceiver.rtpSender
                          ? (sdp += 'a=sendonly\r\n')
                          : transceiver.rtpReceiver
                            ? (sdp += 'a=recvonly\r\n')
                            : (sdp += 'a=inactive\r\n'),
                    transceiver.rtpSender)
                  ) {
                    var msid =
                      'msid:' +
                      stream.id +
                      ' ' +
                      transceiver.rtpSender.track.id +
                      '\r\n';
                    (sdp += 'a=' + msid),
                      (sdp +=
                        'a=ssrc:' +
                        transceiver.sendEncodingParameters[0].ssrc +
                        ' ' +
                        msid),
                      transceiver.sendEncodingParameters[0].rtx &&
                        ((sdp +=
                          'a=ssrc:' +
                          transceiver.sendEncodingParameters[0].rtx.ssrc +
                          ' ' +
                          msid),
                        (sdp +=
                          'a=ssrc-group:FID ' +
                          transceiver.sendEncodingParameters[0].ssrc +
                          ' ' +
                          transceiver.sendEncodingParameters[0].rtx.ssrc +
                          '\r\n'));
                  }
                  return (
                    (sdp +=
                      'a=ssrc:' +
                      transceiver.sendEncodingParameters[0].ssrc +
                      ' cname:' +
                      SDPUtils.localCName +
                      '\r\n'),
                    transceiver.rtpSender &&
                      transceiver.sendEncodingParameters[0].rtx &&
                      (sdp +=
                        'a=ssrc:' +
                        transceiver.sendEncodingParameters[0].rtx.ssrc +
                        ' cname:' +
                        SDPUtils.localCName +
                        '\r\n'),
                    sdp
                  );
                }
                function filterIceServers(iceServers, edgeVersion) {
                  var hasTurn = !1;
                  return (
                    (iceServers = JSON.parse(JSON.stringify(iceServers))),
                    iceServers.filter(function(server) {
                      if (server && (server.urls || server.url)) {
                        var urls = server.urls || server.url;
                        server.url && server.urls;
                        var isString = 'string' == typeof urls;
                        return (
                          isString && (urls = [urls]),
                          (urls = urls.filter(function(url) {
                            return 0 !== url.indexOf('turn:') ||
                              -1 === url.indexOf('transport=udp') ||
                              -1 !== url.indexOf('turn:[') ||
                              hasTurn
                              ? 0 === url.indexOf('stun:') &&
                                  edgeVersion >= 14393 &&
                                  -1 === url.indexOf('?transport=udp')
                              : ((hasTurn = !0), !0);
                          })),
                          delete server.url,
                          (server.urls = isString ? urls[0] : urls),
                          !!urls.length
                        );
                      }
                      return !1;
                    })
                  );
                }
                function getCommonCapabilities(
                  localCapabilities,
                  remoteCapabilities
                ) {
                  var commonCapabilities = {
                      codecs: [],
                      headerExtensions: [],
                      fecMechanisms: []
                    },
                    findCodecByPayloadType = function(pt, codecs) {
                      pt = parseInt(pt, 10);
                      for (var i = 0; i < codecs.length; i++)
                        if (
                          codecs[i].payloadType === pt ||
                          codecs[i].preferredPayloadType === pt
                        )
                          return codecs[i];
                    },
                    rtxCapabilityMatches = function(
                      lRtx,
                      rRtx,
                      lCodecs,
                      rCodecs
                    ) {
                      var lCodec = findCodecByPayloadType(
                          lRtx.parameters.apt,
                          lCodecs
                        ),
                        rCodec = findCodecByPayloadType(
                          rRtx.parameters.apt,
                          rCodecs
                        );
                      return (
                        lCodec &&
                        rCodec &&
                        lCodec.name.toLowerCase() === rCodec.name.toLowerCase()
                      );
                    };
                  return (
                    localCapabilities.codecs.forEach(function(lCodec) {
                      for (
                        var i = 0;
                        i < remoteCapabilities.codecs.length;
                        i++
                      ) {
                        var rCodec = remoteCapabilities.codecs[i];
                        if (
                          lCodec.name.toLowerCase() ===
                            rCodec.name.toLowerCase() &&
                          lCodec.clockRate === rCodec.clockRate
                        ) {
                          if (
                            'rtx' === lCodec.name.toLowerCase() &&
                            lCodec.parameters &&
                            rCodec.parameters.apt &&
                            !rtxCapabilityMatches(
                              lCodec,
                              rCodec,
                              localCapabilities.codecs,
                              remoteCapabilities.codecs
                            )
                          )
                            continue;
                          (rCodec = JSON.parse(JSON.stringify(rCodec))),
                            (rCodec.numChannels = Math.min(
                              lCodec.numChannels,
                              rCodec.numChannels
                            )),
                            commonCapabilities.codecs.push(rCodec),
                            (rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(
                              function(fb) {
                                for (
                                  var j = 0;
                                  j < lCodec.rtcpFeedback.length;
                                  j++
                                )
                                  if (
                                    lCodec.rtcpFeedback[j].type === fb.type &&
                                    lCodec.rtcpFeedback[j].parameter ===
                                      fb.parameter
                                  )
                                    return !0;
                                return !1;
                              }
                            ));
                          break;
                        }
                      }
                    }),
                    localCapabilities.headerExtensions.forEach(function(
                      lHeaderExtension
                    ) {
                      for (
                        var i = 0;
                        i < remoteCapabilities.headerExtensions.length;
                        i++
                      ) {
                        var rHeaderExtension =
                          remoteCapabilities.headerExtensions[i];
                        if (lHeaderExtension.uri === rHeaderExtension.uri) {
                          commonCapabilities.headerExtensions.push(
                            rHeaderExtension
                          );
                          break;
                        }
                      }
                    }),
                    commonCapabilities
                  );
                }
                function isActionAllowedInSignalingState(
                  action,
                  type,
                  signalingState
                ) {
                  return (
                    -1 !==
                    {
                      offer: {
                        setLocalDescription: ['stable', 'have-local-offer'],
                        setRemoteDescription: ['stable', 'have-remote-offer']
                      },
                      answer: {
                        setLocalDescription: [
                          'have-remote-offer',
                          'have-local-pranswer'
                        ],
                        setRemoteDescription: [
                          'have-local-offer',
                          'have-remote-pranswer'
                        ]
                      }
                    }[type][action].indexOf(signalingState)
                  );
                }
                function maybeAddCandidate(iceTransport, candidate) {
                  iceTransport
                    .getRemoteCandidates()
                    .find(function(remoteCandidate) {
                      return (
                        candidate.foundation === remoteCandidate.foundation &&
                        candidate.ip === remoteCandidate.ip &&
                        candidate.port === remoteCandidate.port &&
                        candidate.priority === remoteCandidate.priority &&
                        candidate.protocol === remoteCandidate.protocol &&
                        candidate.type === remoteCandidate.type
                      );
                    }) || iceTransport.addRemoteCandidate(candidate);
                }
                var SDPUtils = requirecopy('sdp');
                module.exports = function(window, edgeVersion) {
                  var RTCPeerConnection = function(config) {
                    var self = this,
                      _eventTarget = document.createDocumentFragment();
                    if (
                      ([
                        'addEventListener',
                        'removeEventListener',
                        'dispatchEvent'
                      ].forEach(function(method) {
                        self[method] = _eventTarget[method].bind(_eventTarget);
                      }),
                      (this.onicecandidate = null),
                      (this.onaddstream = null),
                      (this.ontrack = null),
                      (this.onremovestream = null),
                      (this.onsignalingstatechange = null),
                      (this.oniceconnectionstatechange = null),
                      (this.onicegatheringstatechange = null),
                      (this.onnegotiationneeded = null),
                      (this.ondatachannel = null),
                      (this.canTrickleIceCandidates = null),
                      (this.needNegotiation = !1),
                      (this.localStreams = []),
                      (this.remoteStreams = []),
                      (this.localDescription = null),
                      (this.remoteDescription = null),
                      (this.signalingState = 'stable'),
                      (this.iceConnectionState = 'new'),
                      (this.iceGatheringState = 'new'),
                      (config = JSON.parse(JSON.stringify(config || {}))),
                      (this.usingBundle = 'max-bundle' === config.bundlePolicy),
                      'negotiate' === config.rtcpMuxPolicy)
                    ) {
                      var e = new Error(
                        "rtcpMuxPolicy 'negotiate' is not supported"
                      );
                      throw ((e.name = 'NotSupportedError'), e);
                    }
                    switch (
                      (config.rtcpMuxPolicy ||
                        (config.rtcpMuxPolicy = 'require'),
                      config.iceTransportPolicy)
                    ) {
                      case 'all':
                      case 'relay':
                        break;
                      default:
                        config.iceTransportPolicy = 'all';
                    }
                    switch (config.bundlePolicy) {
                      case 'balanced':
                      case 'max-compat':
                      case 'max-bundle':
                        break;
                      default:
                        config.bundlePolicy = 'balanced';
                    }
                    if (
                      ((config.iceServers = filterIceServers(
                        config.iceServers || [],
                        edgeVersion
                      )),
                      (this._iceGatherers = []),
                      config.iceCandidatePoolSize)
                    )
                      for (var i = config.iceCandidatePoolSize; i > 0; i--)
                        this._iceGatherers = new window.RTCIceGatherer({
                          iceServers: config.iceServers,
                          gatherPolicy: config.iceTransportPolicy
                        });
                    else config.iceCandidatePoolSize = 0;
                    (this._config = config),
                      (this.transceivers = []),
                      (this._sdpSessionId = SDPUtils.generateSessionId()),
                      (this._sdpSessionVersion = 0);
                  };
                  return (
                    (RTCPeerConnection.prototype._emitGatheringStateChange = function() {
                      var event = new Event('icegatheringstatechange');
                      this.dispatchEvent(event),
                        null !== this.onicegatheringstatechange &&
                          this.onicegatheringstatechange(event);
                    }),
                    (RTCPeerConnection.prototype.getConfiguration = function() {
                      return this._config;
                    }),
                    (RTCPeerConnection.prototype.getLocalStreams = function() {
                      return this.localStreams;
                    }),
                    (RTCPeerConnection.prototype.getRemoteStreams = function() {
                      return this.remoteStreams;
                    }),
                    (RTCPeerConnection.prototype._createTransceiver = function(
                      kind
                    ) {
                      var hasBundleTransport = this.transceivers.length > 0,
                        transceiver = {
                          track: null,
                          iceGatherer: null,
                          iceTransport: null,
                          dtlsTransport: null,
                          localCapabilities: null,
                          remoteCapabilities: null,
                          rtpSender: null,
                          rtpReceiver: null,
                          kind: kind,
                          mid: null,
                          sendEncodingParameters: null,
                          recvEncodingParameters: null,
                          stream: null,
                          wantReceive: !0
                        };
                      if (this.usingBundle && hasBundleTransport)
                        (transceiver.iceTransport = this.transceivers[0].iceTransport),
                          (transceiver.dtlsTransport = this.transceivers[0].dtlsTransport);
                      else {
                        var transports = this._createIceAndDtlsTransports();
                        (transceiver.iceTransport = transports.iceTransport),
                          (transceiver.dtlsTransport =
                            transports.dtlsTransport);
                      }
                      return this.transceivers.push(transceiver), transceiver;
                    }),
                    (RTCPeerConnection.prototype.addTrack = function(
                      track,
                      stream
                    ) {
                      for (
                        var transceiver, i = 0;
                        i < this.transceivers.length;
                        i++
                      )
                        this.transceivers[i].track ||
                          this.transceivers[i].kind !== track.kind ||
                          (transceiver = this.transceivers[i]);
                      return (
                        transceiver ||
                          (transceiver = this._createTransceiver(track.kind)),
                        this._maybeFireNegotiationNeeded(),
                        -1 === this.localStreams.indexOf(stream) &&
                          this.localStreams.push(stream),
                        (transceiver.track = track),
                        (transceiver.stream = stream),
                        (transceiver.rtpSender = new window.RTCRtpSender(
                          track,
                          transceiver.dtlsTransport
                        )),
                        transceiver.rtpSender
                      );
                    }),
                    (RTCPeerConnection.prototype.addStream = function(stream) {
                      var self = this;
                      if (edgeVersion >= 15025)
                        stream.getTracks().forEach(function(track) {
                          self.addTrack(track, stream);
                        });
                      else {
                        var clonedStream = stream.clone();
                        stream.getTracks().forEach(function(track, idx) {
                          var clonedTrack = clonedStream.getTracks()[idx];
                          track.addEventListener('enabled', function(event) {
                            clonedTrack.enabled = event.enabled;
                          });
                        }),
                          clonedStream.getTracks().forEach(function(track) {
                            self.addTrack(track, clonedStream);
                          });
                      }
                    }),
                    (RTCPeerConnection.prototype.removeStream = function(
                      stream
                    ) {
                      var idx = this.localStreams.indexOf(stream);
                      idx > -1 &&
                        (this.localStreams.splice(idx, 1),
                        this._maybeFireNegotiationNeeded());
                    }),
                    (RTCPeerConnection.prototype.getSenders = function() {
                      return this.transceivers
                        .filter(function(transceiver) {
                          return !!transceiver.rtpSender;
                        })
                        .map(function(transceiver) {
                          return transceiver.rtpSender;
                        });
                    }),
                    (RTCPeerConnection.prototype.getReceivers = function() {
                      return this.transceivers
                        .filter(function(transceiver) {
                          return !!transceiver.rtpReceiver;
                        })
                        .map(function(transceiver) {
                          return transceiver.rtpReceiver;
                        });
                    }),
                    (RTCPeerConnection.prototype._createIceGatherer = function(
                      sdpMLineIndex,
                      usingBundle
                    ) {
                      var self = this;
                      if (usingBundle && sdpMLineIndex > 0)
                        return this.transceivers[0].iceGatherer;
                      if (this._iceGatherers.length)
                        return this._iceGatherers.shift();
                      var iceGatherer = new window.RTCIceGatherer({
                        iceServers: this._config.iceServers,
                        gatherPolicy: this._config.iceTransportPolicy
                      });
                      return (
                        Object.defineProperty(iceGatherer, 'state', {
                          value: 'new',
                          writable: !0
                        }),
                        (this.transceivers[sdpMLineIndex].candidates = []),
                        (this.transceivers[
                          sdpMLineIndex
                        ].bufferCandidates = function(event) {
                          var end =
                            !event.candidate ||
                            0 === Object.keys(event.candidate).length;
                          (iceGatherer.state = end ? 'completed' : 'gathering'),
                            null !==
                              self.transceivers[sdpMLineIndex].candidates &&
                              self.transceivers[sdpMLineIndex].candidates.push(
                                event.candidate
                              );
                        }),
                        iceGatherer.addEventListener(
                          'localcandidate',
                          this.transceivers[sdpMLineIndex].bufferCandidates
                        ),
                        iceGatherer
                      );
                    }),
                    (RTCPeerConnection.prototype._gather = function(
                      mid,
                      sdpMLineIndex
                    ) {
                      var self = this,
                        iceGatherer = this.transceivers[sdpMLineIndex]
                          .iceGatherer;
                      if (!iceGatherer.onlocalcandidate) {
                        var candidates = this.transceivers[sdpMLineIndex]
                          .candidates;
                        (this.transceivers[sdpMLineIndex].candidates = null),
                          iceGatherer.removeEventListener(
                            'localcandidate',
                            this.transceivers[sdpMLineIndex].bufferCandidates
                          ),
                          (iceGatherer.onlocalcandidate = function(evt) {
                            if (!(self.usingBundle && sdpMLineIndex > 0)) {
                              var event = new Event('icecandidate');
                              event.candidate = {
                                sdpMid: mid,
                                sdpMLineIndex: sdpMLineIndex
                              };
                              var cand = evt.candidate,
                                end = !cand || 0 === Object.keys(cand).length;
                              end
                                ? ('new' !== iceGatherer.state &&
                                    'gathering' !== iceGatherer.state) ||
                                  (iceGatherer.state = 'completed')
                                : ('new' === iceGatherer.state &&
                                    (iceGatherer.state = 'gathering'),
                                  (cand.component = 1),
                                  (event.candidate.candidate = SDPUtils.writeCandidate(
                                    cand
                                  )));
                              var sections = SDPUtils.splitSections(
                                self.localDescription.sdp
                              );
                              (sections[
                                event.candidate.sdpMLineIndex + 1
                              ] += end
                                ? 'a=end-of-candidates\r\n'
                                : 'a=' + event.candidate.candidate + '\r\n'),
                                (self.localDescription.sdp = sections.join(''));
                              var complete = self.transceivers.every(function(
                                transceiver
                              ) {
                                return (
                                  transceiver.iceGatherer &&
                                  'completed' === transceiver.iceGatherer.state
                                );
                              });
                              'gathering' !== self.iceGatheringState &&
                                ((self.iceGatheringState = 'gathering'),
                                self._emitGatheringStateChange()),
                                end ||
                                  (self.dispatchEvent(event),
                                  null !== self.onicecandidate &&
                                    self.onicecandidate(event)),
                                complete &&
                                  (self.dispatchEvent(
                                    new Event('icecandidate')
                                  ),
                                  null !== self.onicecandidate &&
                                    self.onicecandidate(
                                      new Event('icecandidate')
                                    ),
                                  (self.iceGatheringState = 'complete'),
                                  self._emitGatheringStateChange());
                            }
                          }),
                          window.setTimeout(function() {
                            candidates.forEach(function(candidate) {
                              var e = new Event('RTCIceGatherEvent');
                              (e.candidate = candidate),
                                iceGatherer.onlocalcandidate(e);
                            });
                          }, 0);
                      }
                    }),
                    (RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
                      var self = this,
                        iceTransport = new window.RTCIceTransport(null);
                      iceTransport.onicestatechange = function() {
                        self._updateConnectionState();
                      };
                      var dtlsTransport = new window.RTCDtlsTransport(
                        iceTransport
                      );
                      return (
                        (dtlsTransport.ondtlsstatechange = function() {
                          self._updateConnectionState();
                        }),
                        (dtlsTransport.onerror = function() {
                          Object.defineProperty(dtlsTransport, 'state', {
                            value: 'failed',
                            writable: !0
                          }),
                            self._updateConnectionState();
                        }),
                        {
                          iceTransport: iceTransport,
                          dtlsTransport: dtlsTransport
                        }
                      );
                    }),
                    (RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
                      sdpMLineIndex
                    ) {
                      var iceGatherer = this.transceivers[sdpMLineIndex]
                        .iceGatherer;
                      iceGatherer &&
                        (delete iceGatherer.onlocalcandidate,
                        delete this.transceivers[sdpMLineIndex].iceGatherer);
                      var iceTransport = this.transceivers[sdpMLineIndex]
                        .iceTransport;
                      iceTransport &&
                        (delete iceTransport.onicestatechange,
                        delete this.transceivers[sdpMLineIndex].iceTransport);
                      var dtlsTransport = this.transceivers[sdpMLineIndex]
                        .dtlsTransport;
                      dtlsTransport &&
                        (delete dtlsTransport.ondtlsstatechange,
                        delete dtlsTransport.onerror,
                        delete this.transceivers[sdpMLineIndex].dtlsTransport);
                    }),
                    (RTCPeerConnection.prototype._transceive = function(
                      transceiver,
                      send,
                      recv
                    ) {
                      var params = getCommonCapabilities(
                        transceiver.localCapabilities,
                        transceiver.remoteCapabilities
                      );
                      send &&
                        transceiver.rtpSender &&
                        ((params.encodings =
                          transceiver.sendEncodingParameters),
                        (params.rtcp = {
                          cname: SDPUtils.localCName,
                          compound: transceiver.rtcpParameters.compound
                        }),
                        transceiver.recvEncodingParameters.length &&
                          (params.rtcp.ssrc =
                            transceiver.recvEncodingParameters[0].ssrc),
                        transceiver.rtpSender.send(params)),
                        recv &&
                          transceiver.rtpReceiver &&
                          ('video' === transceiver.kind &&
                            transceiver.recvEncodingParameters &&
                            edgeVersion < 15019 &&
                            transceiver.recvEncodingParameters.forEach(function(
                              p
                            ) {
                              delete p.rtx;
                            }),
                          (params.encodings =
                            transceiver.recvEncodingParameters),
                          (params.rtcp = {
                            cname: transceiver.rtcpParameters.cname,
                            compound: transceiver.rtcpParameters.compound
                          }),
                          transceiver.sendEncodingParameters.length &&
                            (params.rtcp.ssrc =
                              transceiver.sendEncodingParameters[0].ssrc),
                          transceiver.rtpReceiver.receive(params));
                    }),
                    (RTCPeerConnection.prototype.setLocalDescription = function(
                      description
                    ) {
                      var self = this,
                        args = arguments;
                      if (
                        !isActionAllowedInSignalingState(
                          'setLocalDescription',
                          description.type,
                          this.signalingState
                        )
                      )
                        return new Promise(function(resolve, reject) {
                          var e = new Error(
                            'Can not set remote ' +
                              description.type +
                              ' in state ' +
                              self.signalingState
                          );
                          (e.name = 'InvalidStateError'),
                            args.length > 2 &&
                              'function' == typeof args[2] &&
                              args[2].apply(null, [e]),
                            reject(e);
                        });
                      var sections, sessionpart;
                      if ('offer' === description.type)
                        (sections = SDPUtils.splitSections(description.sdp)),
                          (sessionpart = sections.shift()),
                          sections.forEach(function(
                            mediaSection,
                            sdpMLineIndex
                          ) {
                            var caps = SDPUtils.parseRtpParameters(
                              mediaSection
                            );
                            self.transceivers[
                              sdpMLineIndex
                            ].localCapabilities = caps;
                          }),
                          this.transceivers.forEach(function(
                            transceiver,
                            sdpMLineIndex
                          ) {
                            self._gather(transceiver.mid, sdpMLineIndex);
                          });
                      else if ('answer' === description.type) {
                        (sections = SDPUtils.splitSections(
                          self.remoteDescription.sdp
                        )),
                          (sessionpart = sections.shift());
                        var isIceLite =
                          SDPUtils.matchPrefix(sessionpart, 'a=ice-lite')
                            .length > 0;
                        sections.forEach(function(mediaSection, sdpMLineIndex) {
                          var transceiver = self.transceivers[sdpMLineIndex],
                            iceGatherer = transceiver.iceGatherer,
                            iceTransport = transceiver.iceTransport,
                            dtlsTransport = transceiver.dtlsTransport,
                            localCapabilities = transceiver.localCapabilities,
                            remoteCapabilities = transceiver.remoteCapabilities;
                          if (
                            !SDPUtils.isRejected(mediaSection) &&
                            !transceiver.isDatachannel
                          ) {
                            var remoteIceParameters = SDPUtils.getIceParameters(
                                mediaSection,
                                sessionpart
                              ),
                              remoteDtlsParameters = SDPUtils.getDtlsParameters(
                                mediaSection,
                                sessionpart
                              );
                            isIceLite && (remoteDtlsParameters.role = 'server'),
                              (self.usingBundle && 0 !== sdpMLineIndex) ||
                                (self._gather(transceiver.mid, sdpMLineIndex),
                                'new' === iceTransport.state &&
                                  iceTransport.start(
                                    iceGatherer,
                                    remoteIceParameters,
                                    isIceLite ? 'controlling' : 'controlled'
                                  ),
                                'new' === dtlsTransport.state &&
                                  dtlsTransport.start(remoteDtlsParameters));
                            var params = getCommonCapabilities(
                              localCapabilities,
                              remoteCapabilities
                            );
                            self._transceive(
                              transceiver,
                              params.codecs.length > 0,
                              !1
                            );
                          }
                        });
                      }
                      switch (
                        ((this.localDescription = {
                          type: description.type,
                          sdp: description.sdp
                        }),
                        description.type)
                      ) {
                        case 'offer':
                          this._updateSignalingState('have-local-offer');
                          break;
                        case 'answer':
                          this._updateSignalingState('stable');
                          break;
                        default:
                          throw new TypeError(
                            'unsupported type "' + description.type + '"'
                          );
                      }
                      var cb =
                        arguments.length > 1 &&
                        'function' == typeof arguments[1] &&
                        arguments[1];
                      return new Promise(function(resolve) {
                        cb && cb.apply(null), resolve();
                      });
                    }),
                    (RTCPeerConnection.prototype.setRemoteDescription = function(
                      description
                    ) {
                      var self = this,
                        args = arguments;
                      if (
                        !isActionAllowedInSignalingState(
                          'setRemoteDescription',
                          description.type,
                          this.signalingState
                        )
                      )
                        return new Promise(function(resolve, reject) {
                          var e = new Error(
                            'Can not set remote ' +
                              description.type +
                              ' in state ' +
                              self.signalingState
                          );
                          (e.name = 'InvalidStateError'),
                            args.length > 2 &&
                              'function' == typeof args[2] &&
                              args[2].apply(null, [e]),
                            reject(e);
                        });
                      var streams = {};
                      this.remoteStreams.forEach(function(stream) {
                        streams[stream.id] = stream;
                      });
                      var receiverList = [],
                        sections = SDPUtils.splitSections(description.sdp),
                        sessionpart = sections.shift(),
                        isIceLite =
                          SDPUtils.matchPrefix(sessionpart, 'a=ice-lite')
                            .length > 0,
                        usingBundle =
                          SDPUtils.matchPrefix(sessionpart, 'a=group:BUNDLE ')
                            .length > 0;
                      this.usingBundle = usingBundle;
                      var iceOptions = SDPUtils.matchPrefix(
                        sessionpart,
                        'a=ice-options:'
                      )[0];
                      switch (
                        ((this.canTrickleIceCandidates =
                          !!iceOptions &&
                          iceOptions
                            .substr(14)
                            .split(' ')
                            .indexOf('trickle') >= 0),
                        sections.forEach(function(mediaSection, sdpMLineIndex) {
                          var lines = SDPUtils.splitLines(mediaSection),
                            kind = SDPUtils.getKind(mediaSection),
                            rejected = SDPUtils.isRejected(mediaSection),
                            protocol = lines[0].substr(2).split(' ')[2],
                            direction = SDPUtils.getDirection(
                              mediaSection,
                              sessionpart
                            ),
                            remoteMsid = SDPUtils.parseMsid(mediaSection),
                            mid =
                              SDPUtils.getMid(mediaSection) ||
                              SDPUtils.generateIdentifier();
                          if (
                            'application' === kind &&
                            'DTLS/SCTP' === protocol
                          )
                            return void (self.transceivers[sdpMLineIndex] = {
                              mid: mid,
                              isDatachannel: !0
                            });
                          var transceiver,
                            iceGatherer,
                            iceTransport,
                            dtlsTransport,
                            rtpReceiver,
                            sendEncodingParameters,
                            recvEncodingParameters,
                            localCapabilities,
                            track,
                            remoteIceParameters,
                            remoteDtlsParameters,
                            remoteCapabilities = SDPUtils.parseRtpParameters(
                              mediaSection
                            );
                          rejected ||
                            ((remoteIceParameters = SDPUtils.getIceParameters(
                              mediaSection,
                              sessionpart
                            )),
                            (remoteDtlsParameters = SDPUtils.getDtlsParameters(
                              mediaSection,
                              sessionpart
                            )),
                            (remoteDtlsParameters.role = 'client')),
                            (recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(
                              mediaSection
                            ));
                          var rtcpParameters = SDPUtils.parseRtcpParameters(
                              mediaSection
                            ),
                            isComplete =
                              SDPUtils.matchPrefix(
                                mediaSection,
                                'a=end-of-candidates',
                                sessionpart
                              ).length > 0,
                            cands = SDPUtils.matchPrefix(
                              mediaSection,
                              'a=candidate:'
                            )
                              .map(function(cand) {
                                return SDPUtils.parseCandidate(cand);
                              })
                              .filter(function(cand) {
                                return 1 === cand.component;
                              });
                          if (
                            (('offer' === description.type ||
                              'answer' === description.type) &&
                              !rejected &&
                              usingBundle &&
                              sdpMLineIndex > 0 &&
                              self.transceivers[sdpMLineIndex] &&
                              (self._disposeIceAndDtlsTransports(sdpMLineIndex),
                              (self.transceivers[sdpMLineIndex].iceGatherer =
                                self.transceivers[0].iceGatherer),
                              (self.transceivers[sdpMLineIndex].iceTransport =
                                self.transceivers[0].iceTransport),
                              (self.transceivers[sdpMLineIndex].dtlsTransport =
                                self.transceivers[0].dtlsTransport),
                              self.transceivers[sdpMLineIndex].rtpSender &&
                                self.transceivers[
                                  sdpMLineIndex
                                ].rtpSender.setTransport(
                                  self.transceivers[0].dtlsTransport
                                ),
                              self.transceivers[sdpMLineIndex].rtpReceiver &&
                                self.transceivers[
                                  sdpMLineIndex
                                ].rtpReceiver.setTransport(
                                  self.transceivers[0].dtlsTransport
                                )),
                            'offer' !== description.type || rejected)
                          )
                            'answer' !== description.type ||
                              rejected ||
                              ((transceiver = self.transceivers[sdpMLineIndex]),
                              (iceGatherer = transceiver.iceGatherer),
                              (iceTransport = transceiver.iceTransport),
                              (dtlsTransport = transceiver.dtlsTransport),
                              (rtpReceiver = transceiver.rtpReceiver),
                              (sendEncodingParameters =
                                transceiver.sendEncodingParameters),
                              (localCapabilities =
                                transceiver.localCapabilities),
                              (self.transceivers[
                                sdpMLineIndex
                              ].recvEncodingParameters = recvEncodingParameters),
                              (self.transceivers[
                                sdpMLineIndex
                              ].remoteCapabilities = remoteCapabilities),
                              (self.transceivers[
                                sdpMLineIndex
                              ].rtcpParameters = rtcpParameters),
                              cands.length &&
                                ((!isIceLite && !isComplete) ||
                                (usingBundle && 0 !== sdpMLineIndex) ||
                                'new' !== iceTransport.state
                                  ? cands.forEach(function(candidate) {
                                      maybeAddCandidate(
                                        transceiver.iceTransport,
                                        candidate
                                      );
                                    })
                                  : iceTransport.setRemoteCandidates(cands)),
                              (usingBundle && 0 !== sdpMLineIndex) ||
                                ('new' === iceTransport.state &&
                                  iceTransport.start(
                                    iceGatherer,
                                    remoteIceParameters,
                                    'controlling'
                                  ),
                                'new' === dtlsTransport.state &&
                                  dtlsTransport.start(remoteDtlsParameters)),
                              self._transceive(
                                transceiver,
                                'sendrecv' === direction ||
                                  'recvonly' === direction,
                                'sendrecv' === direction ||
                                  'sendonly' === direction
                              ),
                              !rtpReceiver ||
                              ('sendrecv' !== direction &&
                                'sendonly' !== direction)
                                ? delete transceiver.rtpReceiver
                                : ((track = rtpReceiver.track),
                                  remoteMsid
                                    ? (streams[remoteMsid.stream] ||
                                        (streams[
                                          remoteMsid.stream
                                        ] = new window.MediaStream()),
                                      streams[remoteMsid.stream].addTrack(
                                        track
                                      ),
                                      receiverList.push([
                                        track,
                                        rtpReceiver,
                                        streams[remoteMsid.stream]
                                      ]))
                                    : (streams.default ||
                                        (streams.default = new window.MediaStream()),
                                      streams.default.addTrack(track),
                                      receiverList.push([
                                        track,
                                        rtpReceiver,
                                        streams.default
                                      ]))));
                          else {
                            if (
                              ((transceiver =
                                self.transceivers[sdpMLineIndex] ||
                                self._createTransceiver(kind)),
                              (transceiver.mid = mid),
                              transceiver.iceGatherer ||
                                (transceiver.iceGatherer = self._createIceGatherer(
                                  sdpMLineIndex,
                                  usingBundle
                                )),
                              cands.length &&
                                (!isComplete ||
                                (usingBundle && 0 !== sdpMLineIndex) ||
                                'new' !== transceiver.iceTransport.state
                                  ? cands.forEach(function(candidate) {
                                      maybeAddCandidate(
                                        transceiver.iceTransport,
                                        candidate
                                      );
                                    })
                                  : transceiver.iceTransport.setRemoteCandidates(
                                      cands
                                    )),
                              (localCapabilities = window.RTCRtpReceiver.getCapabilities(
                                kind
                              )),
                              edgeVersion < 15019 &&
                                (localCapabilities.codecs = localCapabilities.codecs.filter(
                                  function(codec) {
                                    return 'rtx' !== codec.name;
                                  }
                                )),
                              (sendEncodingParameters = [
                                { ssrc: 1001 * (2 * sdpMLineIndex + 2) }
                              ]),
                              'sendrecv' === direction ||
                                'sendonly' === direction)
                            ) {
                              var isNewTrack = !transceiver.rtpReceiver;
                              if (
                                ((rtpReceiver =
                                  transceiver.rtpReceiver ||
                                  new window.RTCRtpReceiver(
                                    transceiver.dtlsTransport,
                                    kind
                                  )),
                                isNewTrack)
                              ) {
                                var stream;
                                (track = rtpReceiver.track),
                                  remoteMsid
                                    ? (streams[remoteMsid.stream] ||
                                        ((streams[
                                          remoteMsid.stream
                                        ] = new window.MediaStream()),
                                        Object.defineProperty(
                                          streams[remoteMsid.stream],
                                          'id',
                                          {
                                            get: function() {
                                              return remoteMsid.stream;
                                            }
                                          }
                                        )),
                                      Object.defineProperty(track, 'id', {
                                        get: function() {
                                          return remoteMsid.track;
                                        }
                                      }),
                                      (stream = streams[remoteMsid.stream]))
                                    : (streams.default ||
                                        (streams.default = new window.MediaStream()),
                                      (stream = streams.default)),
                                  stream.addTrack(track),
                                  receiverList.push([
                                    track,
                                    rtpReceiver,
                                    stream
                                  ]);
                              }
                            }
                            (transceiver.localCapabilities = localCapabilities),
                              (transceiver.remoteCapabilities = remoteCapabilities),
                              (transceiver.rtpReceiver = rtpReceiver),
                              (transceiver.rtcpParameters = rtcpParameters),
                              (transceiver.sendEncodingParameters = sendEncodingParameters),
                              (transceiver.recvEncodingParameters = recvEncodingParameters),
                              self._transceive(
                                self.transceivers[sdpMLineIndex],
                                !1,
                                'sendrecv' === direction ||
                                  'sendonly' === direction
                              );
                          }
                        }),
                        (this.remoteDescription = {
                          type: description.type,
                          sdp: description.sdp
                        }),
                        description.type)
                      ) {
                        case 'offer':
                          this._updateSignalingState('have-remote-offer');
                          break;
                        case 'answer':
                          this._updateSignalingState('stable');
                          break;
                        default:
                          throw new TypeError(
                            'unsupported type "' + description.type + '"'
                          );
                      }
                      return (
                        Object.keys(streams).forEach(function(sid) {
                          var stream = streams[sid];
                          if (stream.getTracks().length) {
                            if (-1 === self.remoteStreams.indexOf(stream)) {
                              self.remoteStreams.push(stream);
                              var event = new Event('addstream');
                              (event.stream = stream),
                                window.setTimeout(function() {
                                  self.dispatchEvent(event),
                                    null !== self.onaddstream &&
                                      self.onaddstream(event);
                                });
                            }
                            receiverList.forEach(function(item) {
                              var track = item[0],
                                receiver = item[1];
                              if (stream.id === item[2].id) {
                                var trackEvent = new Event('track');
                                (trackEvent.track = track),
                                  (trackEvent.receiver = receiver),
                                  (trackEvent.transceiver = {
                                    receiver: receiver
                                  }),
                                  (trackEvent.streams = [stream]),
                                  window.setTimeout(function() {
                                    self.dispatchEvent(trackEvent),
                                      null !== self.ontrack &&
                                        self.ontrack(trackEvent);
                                  });
                              }
                            });
                          }
                        }),
                        window.setTimeout(function() {
                          self &&
                            self.transceivers &&
                            self.transceivers.forEach(function(transceiver) {
                              transceiver.iceTransport &&
                                'new' === transceiver.iceTransport.state &&
                                transceiver.iceTransport.getRemoteCandidates()
                                  .length > 0 &&
                                transceiver.iceTransport.addRemoteCandidate({});
                            });
                        }, 4e3),
                        new Promise(function(resolve) {
                          args.length > 1 &&
                            'function' == typeof args[1] &&
                            args[1].apply(null),
                            resolve();
                        })
                      );
                    }),
                    (RTCPeerConnection.prototype.close = function() {
                      this.transceivers.forEach(function(transceiver) {
                        transceiver.iceTransport &&
                          transceiver.iceTransport.stop(),
                          transceiver.dtlsTransport &&
                            transceiver.dtlsTransport.stop(),
                          transceiver.rtpSender && transceiver.rtpSender.stop(),
                          transceiver.rtpReceiver &&
                            transceiver.rtpReceiver.stop();
                      }),
                        this._updateSignalingState('closed');
                    }),
                    (RTCPeerConnection.prototype._updateSignalingState = function(
                      newState
                    ) {
                      this.signalingState = newState;
                      var event = new Event('signalingstatechange');
                      this.dispatchEvent(event),
                        null !== this.onsignalingstatechange &&
                          this.onsignalingstatechange(event);
                    }),
                    (RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
                      var self = this;
                      'stable' === this.signalingState &&
                        !0 !== this.needNegotiation &&
                        ((this.needNegotiation = !0),
                        window.setTimeout(function() {
                          if (!1 !== self.needNegotiation) {
                            self.needNegotiation = !1;
                            var event = new Event('negotiationneeded');
                            self.dispatchEvent(event),
                              null !== self.onnegotiationneeded &&
                                self.onnegotiationneeded(event);
                          }
                        }, 0));
                    }),
                    (RTCPeerConnection.prototype._updateConnectionState = function() {
                      var newState,
                        self = this,
                        states = {
                          new: 0,
                          closed: 0,
                          connecting: 0,
                          checking: 0,
                          connected: 0,
                          completed: 0,
                          disconnected: 0,
                          failed: 0
                        };
                      if (
                        (this.transceivers.forEach(function(transceiver) {
                          states[transceiver.iceTransport.state]++,
                            states[transceiver.dtlsTransport.state]++;
                        }),
                        (states.connected += states.completed),
                        (newState = 'new'),
                        states.failed > 0
                          ? (newState = 'failed')
                          : states.connecting > 0 || states.checking > 0
                            ? (newState = 'connecting')
                            : states.disconnected > 0
                              ? (newState = 'disconnected')
                              : states.new > 0
                                ? (newState = 'new')
                                : (states.connected > 0 ||
                                    states.completed > 0) &&
                                  (newState = 'connected'),
                        newState !== self.iceConnectionState)
                      ) {
                        self.iceConnectionState = newState;
                        var event = new Event('iceconnectionstatechange');
                        this.dispatchEvent(event),
                          null !== this.oniceconnectionstatechange &&
                            this.oniceconnectionstatechange(event);
                      }
                    }),
                    (RTCPeerConnection.prototype.createOffer = function() {
                      var offerOptions,
                        self = this,
                        args = arguments;
                      1 === arguments.length &&
                      'function' != typeof arguments[0]
                        ? (offerOptions = arguments[0])
                        : 3 === arguments.length &&
                          (offerOptions = arguments[2]);
                      var numAudioTracks = this.transceivers.filter(function(
                          t
                        ) {
                          return 'audio' === t.kind;
                        }).length,
                        numVideoTracks = this.transceivers.filter(function(t) {
                          return 'video' === t.kind;
                        }).length;
                      if (offerOptions) {
                        if (offerOptions.mandatory || offerOptions.optional)
                          throw new TypeError(
                            'Legacy mandatory/optional constraints not supported.'
                          );
                        void 0 !== offerOptions.offerToReceiveAudio &&
                          (numAudioTracks =
                            !0 === offerOptions.offerToReceiveAudio
                              ? 1
                              : !1 === offerOptions.offerToReceiveAudio
                                ? 0
                                : offerOptions.offerToReceiveAudio),
                          void 0 !== offerOptions.offerToReceiveVideo &&
                            (numVideoTracks =
                              !0 === offerOptions.offerToReceiveVideo
                                ? 1
                                : !1 === offerOptions.offerToReceiveVideo
                                  ? 0
                                  : offerOptions.offerToReceiveVideo);
                      }
                      for (
                        this.transceivers.forEach(function(transceiver) {
                          'audio' === transceiver.kind
                            ? --numAudioTracks < 0 &&
                              (transceiver.wantReceive = !1)
                            : 'video' === transceiver.kind &&
                              --numVideoTracks < 0 &&
                              (transceiver.wantReceive = !1);
                        });
                        numAudioTracks > 0 || numVideoTracks > 0;

                      )
                        numAudioTracks > 0 &&
                          (this._createTransceiver('audio'), numAudioTracks--),
                          numVideoTracks > 0 &&
                            (this._createTransceiver('video'),
                            numVideoTracks--);
                      var sdp = SDPUtils.writeSessionBoilerplate(
                        this._sdpSessionId,
                        this._sdpSessionVersion++
                      );
                      this.transceivers.forEach(function(
                        transceiver,
                        sdpMLineIndex
                      ) {
                        var track = transceiver.track,
                          kind = transceiver.kind,
                          mid = SDPUtils.generateIdentifier();
                        (transceiver.mid = mid),
                          transceiver.iceGatherer ||
                            (transceiver.iceGatherer = self._createIceGatherer(
                              sdpMLineIndex,
                              self.usingBundle
                            ));
                        var localCapabilities = window.RTCRtpSender.getCapabilities(
                          kind
                        );
                        edgeVersion < 15019 &&
                          (localCapabilities.codecs = localCapabilities.codecs.filter(
                            function(codec) {
                              return 'rtx' !== codec.name;
                            }
                          )),
                          localCapabilities.codecs.forEach(function(codec) {
                            'H264' === codec.name &&
                              void 0 ===
                                codec.parameters['level-asymmetry-allowed'] &&
                              (codec.parameters['level-asymmetry-allowed'] =
                                '1');
                          });
                        var sendEncodingParameters = [
                          { ssrc: 1001 * (2 * sdpMLineIndex + 1) }
                        ];
                        track &&
                          edgeVersion >= 15019 &&
                          'video' === kind &&
                          (sendEncodingParameters[0].rtx = {
                            ssrc: 1001 * (2 * sdpMLineIndex + 1) + 1
                          }),
                          transceiver.wantReceive &&
                            (transceiver.rtpReceiver = new window.RTCRtpReceiver(
                              transceiver.dtlsTransport,
                              kind
                            )),
                          (transceiver.localCapabilities = localCapabilities),
                          (transceiver.sendEncodingParameters = sendEncodingParameters);
                      }),
                        'max-compat' !== this._config.bundlePolicy &&
                          (sdp +=
                            'a=group:BUNDLE ' +
                            this.transceivers
                              .map(function(t) {
                                return t.mid;
                              })
                              .join(' ') +
                            '\r\n'),
                        (sdp += 'a=ice-options:trickle\r\n'),
                        this.transceivers.forEach(function(
                          transceiver,
                          sdpMLineIndex
                        ) {
                          (sdp += writeMediaSection(
                            transceiver,
                            transceiver.localCapabilities,
                            'offer',
                            transceiver.stream
                          )),
                            (sdp += 'a=rtcp-rsize\r\n'),
                            !transceiver.iceGatherer ||
                              'new' === self.iceGatheringState ||
                              (0 !== sdpMLineIndex && self.usingBundle) ||
                              (transceiver.iceGatherer
                                .getLocalCandidates()
                                .forEach(function(cand) {
                                  (cand.component = 1),
                                    (sdp +=
                                      'a=' +
                                      SDPUtils.writeCandidate(cand) +
                                      '\r\n');
                                }),
                              'completed' === transceiver.iceGatherer.state &&
                                (sdp += 'a=end-of-candidates\r\n'));
                        });
                      var desc = new window.RTCSessionDescription({
                        type: 'offer',
                        sdp: sdp
                      });
                      return new Promise(function(resolve) {
                        if (args.length > 0 && 'function' == typeof args[0])
                          return args[0].apply(null, [desc]), void resolve();
                        resolve(desc);
                      });
                    }),
                    (RTCPeerConnection.prototype.createAnswer = function() {
                      var args = arguments,
                        sdp = SDPUtils.writeSessionBoilerplate(
                          this._sdpSessionId,
                          this._sdpSessionVersion++
                        );
                      this.usingBundle &&
                        (sdp +=
                          'a=group:BUNDLE ' +
                          this.transceivers
                            .map(function(t) {
                              return t.mid;
                            })
                            .join(' ') +
                          '\r\n');
                      var mediaSectionsInOffer =
                        SDPUtils.splitSections(this.remoteDescription.sdp)
                          .length - 1;
                      this.transceivers.forEach(function(
                        transceiver,
                        sdpMLineIndex
                      ) {
                        if (!(sdpMLineIndex + 1 > mediaSectionsInOffer)) {
                          if (transceiver.isDatachannel)
                            return void (sdp +=
                              'm=application 0 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=mid:' +
                              transceiver.mid +
                              '\r\n');
                          if (transceiver.stream) {
                            var localTrack;
                            'audio' === transceiver.kind
                              ? (localTrack = transceiver.stream.getAudioTracks()[0])
                              : 'video' === transceiver.kind &&
                                (localTrack = transceiver.stream.getVideoTracks()[0]),
                              localTrack &&
                                edgeVersion >= 15019 &&
                                'video' === transceiver.kind &&
                                (transceiver.sendEncodingParameters[0].rtx = {
                                  ssrc: 1001 * (2 * sdpMLineIndex + 2) + 1
                                });
                          }
                          var commonCapabilities = getCommonCapabilities(
                            transceiver.localCapabilities,
                            transceiver.remoteCapabilities
                          );
                          !commonCapabilities.codecs.filter(function(c) {
                            return 'rtx' === c.name.toLowerCase();
                          }).length &&
                            transceiver.sendEncodingParameters[0].rtx &&
                            delete transceiver.sendEncodingParameters[0].rtx,
                            (sdp += writeMediaSection(
                              transceiver,
                              commonCapabilities,
                              'answer',
                              transceiver.stream
                            )),
                            transceiver.rtcpParameters &&
                              transceiver.rtcpParameters.reducedSize &&
                              (sdp += 'a=rtcp-rsize\r\n');
                        }
                      });
                      var desc = new window.RTCSessionDescription({
                        type: 'answer',
                        sdp: sdp
                      });
                      return new Promise(function(resolve) {
                        if (args.length > 0 && 'function' == typeof args[0])
                          return args[0].apply(null, [desc]), void resolve();
                        resolve(desc);
                      });
                    }),
                    (RTCPeerConnection.prototype.addIceCandidate = function(
                      candidate
                    ) {
                      var err, sections;
                      if (candidate && '' !== candidate.candidate) {
                        if (!candidate.sdpMLineIndex && !candidate.sdpMid)
                          throw new TypeError(
                            'sdpMLineIndex or sdpMid required'
                          );
                        if (this.remoteDescription) {
                          var sdpMLineIndex = candidate.sdpMLineIndex;
                          if (candidate.sdpMid)
                            for (var i = 0; i < this.transceivers.length; i++)
                              if (
                                this.transceivers[i].mid === candidate.sdpMid
                              ) {
                                sdpMLineIndex = i;
                                break;
                              }
                          var transceiver = this.transceivers[sdpMLineIndex];
                          if (transceiver) {
                            if (transceiver.isDatachannel)
                              return Promise.resolve();
                            var cand =
                              Object.keys(candidate.candidate).length > 0
                                ? SDPUtils.parseCandidate(candidate.candidate)
                                : {};
                            if (
                              'tcp' === cand.protocol &&
                              (0 === cand.port || 9 === cand.port)
                            )
                              return Promise.resolve();
                            if (cand.component && 1 !== cand.component)
                              return Promise.resolve();
                            (0 === sdpMLineIndex ||
                              (sdpMLineIndex > 0 &&
                                transceiver.iceTransport !==
                                  this.transceivers[0].iceTransport)) &&
                              transceiver.iceTransport.addRemoteCandidate(cand);
                            var candidateString = candidate.candidate.trim();
                            0 === candidateString.indexOf('a=') &&
                              (candidateString = candidateString.substr(2)),
                              (sections = SDPUtils.splitSections(
                                this.remoteDescription.sdp
                              )),
                              (sections[sdpMLineIndex + 1] +=
                                'a=' +
                                (cand.type
                                  ? candidateString
                                  : 'end-of-candidates') +
                                '\r\n'),
                              (this.remoteDescription.sdp = sections.join(''));
                          } else
                            (err = new Error('Can not add ICE candidate')),
                              (err.name = 'OperationError');
                        } else
                          (err = new Error(
                            'Can not add ICE candidate without a remote description'
                          )),
                            (err.name = 'InvalidStateError');
                      } else
                        for (
                          var j = 0;
                          j < this.transceivers.length &&
                          (this.transceivers[j].isDatachannel ||
                            (this.transceivers[
                              j
                            ].iceTransport.addRemoteCandidate({}),
                            (sections = SDPUtils.splitSections(
                              this.remoteDescription.sdp
                            )),
                            (sections[j + 1] += 'a=end-of-candidates\r\n'),
                            (this.remoteDescription.sdp = sections.join('')),
                            !this.usingBundle));
                          j++
                        );
                      var args = arguments;
                      return new Promise(function(resolve, reject) {
                        err
                          ? (args.length > 2 &&
                              'function' == typeof args[2] &&
                              args[2].apply(null, [err]),
                            reject(err))
                          : (args.length > 1 &&
                              'function' == typeof args[1] &&
                              args[1].apply(null),
                            resolve());
                      });
                    }),
                    (RTCPeerConnection.prototype.getStats = function() {
                      var promises = [];
                      this.transceivers.forEach(function(transceiver) {
                        [
                          'rtpSender',
                          'rtpReceiver',
                          'iceGatherer',
                          'iceTransport',
                          'dtlsTransport'
                        ].forEach(function(method) {
                          transceiver[method] &&
                            promises.push(transceiver[method].getStats());
                        });
                      });
                      var cb =
                          arguments.length > 1 &&
                          'function' == typeof arguments[1] &&
                          arguments[1],
                        fixStatsType = function(stat) {
                          return (
                            {
                              inboundrtp: 'inbound-rtp',
                              outboundrtp: 'outbound-rtp',
                              candidatepair: 'candidate-pair',
                              localcandidate: 'local-candidate',
                              remotecandidate: 'remote-candidate'
                            }[stat.type] || stat.type
                          );
                        };
                      return new Promise(function(resolve) {
                        var results = new Map();
                        Promise.all(promises).then(function(res) {
                          res.forEach(function(result) {
                            Object.keys(result).forEach(function(id) {
                              (result[id].type = fixStatsType(result[id])),
                                results.set(id, result[id]);
                            });
                          }),
                            cb && cb.apply(null, results),
                            resolve(results);
                        });
                      });
                    }),
                    RTCPeerConnection
                  );
                };
              },
              { sdp: 2 }
            ],
            2: [
              function(requirecopy, module, exports) {
                'use strict';
                var SDPUtils = {};
                (SDPUtils.generateIdentifier = function() {
                  return Math.random()
                    .toString(36)
                    .substr(2, 10);
                }),
                  (SDPUtils.localCName = SDPUtils.generateIdentifier()),
                  (SDPUtils.splitLines = function(blob) {
                    return blob
                      .trim()
                      .split('\n')
                      .map(function(line) {
                        return line.trim();
                      });
                  }),
                  (SDPUtils.splitSections = function(blob) {
                    return blob.split('\nm=').map(function(part, index) {
                      return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
                    });
                  }),
                  (SDPUtils.matchPrefix = function(blob, prefix) {
                    return SDPUtils.splitLines(blob).filter(function(line) {
                      return 0 === line.indexOf(prefix);
                    });
                  }),
                  (SDPUtils.parseCandidate = function(line) {
                    var parts;
                    parts =
                      0 === line.indexOf('a=candidate:')
                        ? line.substring(12).split(' ')
                        : line.substring(10).split(' ');
                    for (
                      var candidate = {
                          foundation: parts[0],
                          component: parseInt(parts[1], 10),
                          protocol: parts[2].toLowerCase(),
                          priority: parseInt(parts[3], 10),
                          ip: parts[4],
                          port: parseInt(parts[5], 10),
                          type: parts[7]
                        },
                        i = 8;
                      i < parts.length;
                      i += 2
                    )
                      switch (parts[i]) {
                        case 'raddr':
                          candidate.relatedAddress = parts[i + 1];
                          break;
                        case 'rport':
                          candidate.relatedPort = parseInt(parts[i + 1], 10);
                          break;
                        case 'tcptype':
                          candidate.tcpType = parts[i + 1];
                          break;
                        case 'ufrag':
                          (candidate.ufrag = parts[i + 1]),
                            (candidate.usernameFragment = parts[i + 1]);
                          break;
                        default:
                          candidate[parts[i]] = parts[i + 1];
                      }
                    return candidate;
                  }),
                  (SDPUtils.writeCandidate = function(candidate) {
                    var sdp = [];
                    sdp.push(candidate.foundation),
                      sdp.push(candidate.component),
                      sdp.push(candidate.protocol.toUpperCase()),
                      sdp.push(candidate.priority),
                      sdp.push(candidate.ip),
                      sdp.push(candidate.port);
                    var type = candidate.type;
                    return (
                      sdp.push('typ'),
                      sdp.push(type),
                      'host' !== type &&
                        candidate.relatedAddress &&
                        candidate.relatedPort &&
                        (sdp.push('raddr'),
                        sdp.push(candidate.relatedAddress),
                        sdp.push('rport'),
                        sdp.push(candidate.relatedPort)),
                      candidate.tcpType &&
                        'tcp' === candidate.protocol.toLowerCase() &&
                        (sdp.push('tcptype'), sdp.push(candidate.tcpType)),
                      candidate.ufrag &&
                        (sdp.push('ufrag'), sdp.push(candidate.ufrag)),
                      'candidate:' + sdp.join(' ')
                    );
                  }),
                  (SDPUtils.parseIceOptions = function(line) {
                    return line.substr(14).split(' ');
                  }),
                  (SDPUtils.parseRtpMap = function(line) {
                    var parts = line.substr(9).split(' '),
                      parsed = { payloadType: parseInt(parts.shift(), 10) };
                    return (
                      (parts = parts[0].split('/')),
                      (parsed.name = parts[0]),
                      (parsed.clockRate = parseInt(parts[1], 10)),
                      (parsed.numChannels =
                        3 === parts.length ? parseInt(parts[2], 10) : 1),
                      parsed
                    );
                  }),
                  (SDPUtils.writeRtpMap = function(codec) {
                    var pt = codec.payloadType;
                    return (
                      void 0 !== codec.preferredPayloadType &&
                        (pt = codec.preferredPayloadType),
                      'a=rtpmap:' +
                        pt +
                        ' ' +
                        codec.name +
                        '/' +
                        codec.clockRate +
                        (1 !== codec.numChannels
                          ? '/' + codec.numChannels
                          : '') +
                        '\r\n'
                    );
                  }),
                  (SDPUtils.parseExtmap = function(line) {
                    var parts = line.substr(9).split(' ');
                    return {
                      id: parseInt(parts[0], 10),
                      direction:
                        parts[0].indexOf('/') > 0
                          ? parts[0].split('/')[1]
                          : 'sendrecv',
                      uri: parts[1]
                    };
                  }),
                  (SDPUtils.writeExtmap = function(headerExtension) {
                    return (
                      'a=extmap:' +
                      (headerExtension.id || headerExtension.preferredId) +
                      (headerExtension.direction &&
                      'sendrecv' !== headerExtension.direction
                        ? '/' + headerExtension.direction
                        : '') +
                      ' ' +
                      headerExtension.uri +
                      '\r\n'
                    );
                  }),
                  (SDPUtils.parseFmtp = function(line) {
                    for (
                      var kv,
                        parsed = {},
                        parts = line.substr(line.indexOf(' ') + 1).split(';'),
                        j = 0;
                      j < parts.length;
                      j++
                    )
                      (kv = parts[j].trim().split('=')),
                        (parsed[kv[0].trim()] = kv[1]);
                    return parsed;
                  }),
                  (SDPUtils.writeFmtp = function(codec) {
                    var line = '',
                      pt = codec.payloadType;
                    if (
                      (void 0 !== codec.preferredPayloadType &&
                        (pt = codec.preferredPayloadType),
                      codec.parameters && Object.keys(codec.parameters).length)
                    ) {
                      var params = [];
                      Object.keys(codec.parameters).forEach(function(param) {
                        params.push(param + '=' + codec.parameters[param]);
                      }),
                        (line +=
                          'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n');
                    }
                    return line;
                  }),
                  (SDPUtils.parseRtcpFb = function(line) {
                    var parts = line.substr(line.indexOf(' ') + 1).split(' ');
                    return { type: parts.shift(), parameter: parts.join(' ') };
                  }),
                  (SDPUtils.writeRtcpFb = function(codec) {
                    var lines = '',
                      pt = codec.payloadType;
                    return (
                      void 0 !== codec.preferredPayloadType &&
                        (pt = codec.preferredPayloadType),
                      codec.rtcpFeedback &&
                        codec.rtcpFeedback.length &&
                        codec.rtcpFeedback.forEach(function(fb) {
                          lines +=
                            'a=rtcp-fb:' +
                            pt +
                            ' ' +
                            fb.type +
                            (fb.parameter && fb.parameter.length
                              ? ' ' + fb.parameter
                              : '') +
                            '\r\n';
                        }),
                      lines
                    );
                  }),
                  (SDPUtils.parseSsrcMedia = function(line) {
                    var sp = line.indexOf(' '),
                      parts = { ssrc: parseInt(line.substr(7, sp - 7), 10) },
                      colon = line.indexOf(':', sp);
                    return (
                      colon > -1
                        ? ((parts.attribute = line.substr(
                            sp + 1,
                            colon - sp - 1
                          )),
                          (parts.value = line.substr(colon + 1)))
                        : (parts.attribute = line.substr(sp + 1)),
                      parts
                    );
                  }),
                  (SDPUtils.getMid = function(mediaSection) {
                    var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
                    if (mid) return mid.substr(6);
                  }),
                  (SDPUtils.parseFingerprint = function(line) {
                    var parts = line.substr(14).split(' ');
                    return {
                      algorithm: parts[0].toLowerCase(),
                      value: parts[1]
                    };
                  }),
                  (SDPUtils.getDtlsParameters = function(
                    mediaSection,
                    sessionpart
                  ) {
                    return {
                      role: 'auto',
                      fingerprints: SDPUtils.matchPrefix(
                        mediaSection + sessionpart,
                        'a=fingerprint:'
                      ).map(SDPUtils.parseFingerprint)
                    };
                  }),
                  (SDPUtils.writeDtlsParameters = function(params, setupType) {
                    var sdp = 'a=setup:' + setupType + '\r\n';
                    return (
                      params.fingerprints.forEach(function(fp) {
                        sdp +=
                          'a=fingerprint:' +
                          fp.algorithm +
                          ' ' +
                          fp.value +
                          '\r\n';
                      }),
                      sdp
                    );
                  }),
                  (SDPUtils.getIceParameters = function(
                    mediaSection,
                    sessionpart
                  ) {
                    var lines = SDPUtils.splitLines(mediaSection);
                    return (
                      (lines = lines.concat(SDPUtils.splitLines(sessionpart))),
                      {
                        usernameFragment: lines
                          .filter(function(line) {
                            return 0 === line.indexOf('a=ice-ufrag:');
                          })[0]
                          .substr(12),
                        password: lines
                          .filter(function(line) {
                            return 0 === line.indexOf('a=ice-pwd:');
                          })[0]
                          .substr(10)
                      }
                    );
                  }),
                  (SDPUtils.writeIceParameters = function(params) {
                    return (
                      'a=ice-ufrag:' +
                      params.usernameFragment +
                      '\r\na=ice-pwd:' +
                      params.password +
                      '\r\n'
                    );
                  }),
                  (SDPUtils.parseRtpParameters = function(mediaSection) {
                    for (
                      var description = {
                          codecs: [],
                          headerExtensions: [],
                          fecMechanisms: [],
                          rtcp: []
                        },
                        lines = SDPUtils.splitLines(mediaSection),
                        mline = lines[0].split(' '),
                        i = 3;
                      i < mline.length;
                      i++
                    ) {
                      var pt = mline[i],
                        rtpmapline = SDPUtils.matchPrefix(
                          mediaSection,
                          'a=rtpmap:' + pt + ' '
                        )[0];
                      if (rtpmapline) {
                        var codec = SDPUtils.parseRtpMap(rtpmapline),
                          fmtps = SDPUtils.matchPrefix(
                            mediaSection,
                            'a=fmtp:' + pt + ' '
                          );
                        switch (
                          ((codec.parameters = fmtps.length
                            ? SDPUtils.parseFmtp(fmtps[0])
                            : {}),
                          (codec.rtcpFeedback = SDPUtils.matchPrefix(
                            mediaSection,
                            'a=rtcp-fb:' + pt + ' '
                          ).map(SDPUtils.parseRtcpFb)),
                          description.codecs.push(codec),
                          codec.name.toUpperCase())
                        ) {
                          case 'RED':
                          case 'ULPFEC':
                            description.fecMechanisms.push(
                              codec.name.toUpperCase()
                            );
                        }
                      }
                    }
                    return (
                      SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(
                        function(line) {
                          description.headerExtensions.push(
                            SDPUtils.parseExtmap(line)
                          );
                        }
                      ),
                      description
                    );
                  }),
                  (SDPUtils.writeRtpDescription = function(kind, caps) {
                    var sdp = '';
                    (sdp += 'm=' + kind + ' '),
                      (sdp += caps.codecs.length > 0 ? '9' : '0'),
                      (sdp += ' UDP/TLS/RTP/SAVPF '),
                      (sdp +=
                        caps.codecs
                          .map(function(codec) {
                            return void 0 !== codec.preferredPayloadType
                              ? codec.preferredPayloadType
                              : codec.payloadType;
                          })
                          .join(' ') + '\r\n'),
                      (sdp += 'c=IN IP4 0.0.0.0\r\n'),
                      (sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n'),
                      caps.codecs.forEach(function(codec) {
                        (sdp += SDPUtils.writeRtpMap(codec)),
                          (sdp += SDPUtils.writeFmtp(codec)),
                          (sdp += SDPUtils.writeRtcpFb(codec));
                      });
                    var maxptime = 0;
                    return (
                      caps.codecs.forEach(function(codec) {
                        codec.maxptime > maxptime &&
                          (maxptime = codec.maxptime);
                      }),
                      maxptime > 0 &&
                        (sdp += 'a=maxptime:' + maxptime + '\r\n'),
                      (sdp += 'a=rtcp-mux\r\n'),
                      caps.headerExtensions.forEach(function(extension) {
                        sdp += SDPUtils.writeExtmap(extension);
                      }),
                      sdp
                    );
                  }),
                  (SDPUtils.parseRtpEncodingParameters = function(
                    mediaSection
                  ) {
                    var secondarySsrc,
                      encodingParameters = [],
                      description = SDPUtils.parseRtpParameters(mediaSection),
                      hasRed = -1 !== description.fecMechanisms.indexOf('RED'),
                      hasUlpfec =
                        -1 !== description.fecMechanisms.indexOf('ULPFEC'),
                      ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                        .map(function(line) {
                          return SDPUtils.parseSsrcMedia(line);
                        })
                        .filter(function(parts) {
                          return 'cname' === parts.attribute;
                        }),
                      primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc,
                      flows = SDPUtils.matchPrefix(
                        mediaSection,
                        'a=ssrc-group:FID'
                      ).map(function(line) {
                        var parts = line.split(' ');
                        return (
                          parts.shift(),
                          parts.map(function(part) {
                            return parseInt(part, 10);
                          })
                        );
                      });
                    flows.length > 0 &&
                      flows[0].length > 1 &&
                      flows[0][0] === primarySsrc &&
                      (secondarySsrc = flows[0][1]),
                      description.codecs.forEach(function(codec) {
                        if (
                          'RTX' === codec.name.toUpperCase() &&
                          codec.parameters.apt
                        ) {
                          var encParam = {
                            ssrc: primarySsrc,
                            codecPayloadType: parseInt(
                              codec.parameters.apt,
                              10
                            ),
                            rtx: { ssrc: secondarySsrc }
                          };
                          encodingParameters.push(encParam),
                            hasRed &&
                              ((encParam = JSON.parse(
                                JSON.stringify(encParam)
                              )),
                              (encParam.fec = {
                                ssrc: secondarySsrc,
                                mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
                              }),
                              encodingParameters.push(encParam));
                        }
                      }),
                      0 === encodingParameters.length &&
                        primarySsrc &&
                        encodingParameters.push({ ssrc: primarySsrc });
                    var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
                    return (
                      bandwidth.length &&
                        ((bandwidth =
                          0 === bandwidth[0].indexOf('b=TIAS:')
                            ? parseInt(bandwidth[0].substr(7), 10)
                            : 0 === bandwidth[0].indexOf('b=AS:')
                              ? 1e3 *
                                  parseInt(bandwidth[0].substr(5), 10) *
                                  0.95 -
                                16e3
                              : void 0),
                        encodingParameters.forEach(function(params) {
                          params.maxBitrate = bandwidth;
                        })),
                      encodingParameters
                    );
                  }),
                  (SDPUtils.parseRtcpParameters = function(mediaSection) {
                    var rtcpParameters = {},
                      remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                        .map(function(line) {
                          return SDPUtils.parseSsrcMedia(line);
                        })
                        .filter(function(obj) {
                          return 'cname' === obj.attribute;
                        })[0];
                    remoteSsrc &&
                      ((rtcpParameters.cname = remoteSsrc.value),
                      (rtcpParameters.ssrc = remoteSsrc.ssrc));
                    var rsize = SDPUtils.matchPrefix(
                      mediaSection,
                      'a=rtcp-rsize'
                    );
                    (rtcpParameters.reducedSize = rsize.length > 0),
                      (rtcpParameters.compound = 0 === rsize.length);
                    var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
                    return (
                      (rtcpParameters.mux = mux.length > 0), rtcpParameters
                    );
                  }),
                  (SDPUtils.parseMsid = function(mediaSection) {
                    var parts,
                      spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
                    if (1 === spec.length)
                      return (
                        (parts = spec[0].substr(7).split(' ')),
                        { stream: parts[0], track: parts[1] }
                      );
                    var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                      .map(function(line) {
                        return SDPUtils.parseSsrcMedia(line);
                      })
                      .filter(function(parts) {
                        return 'msid' === parts.attribute;
                      });
                    return planB.length > 0
                      ? ((parts = planB[0].value.split(' ')),
                        { stream: parts[0], track: parts[1] })
                      : void 0;
                  }),
                  (SDPUtils.generateSessionId = function() {
                    return Math.random()
                      .toString()
                      .substr(2, 21);
                  }),
                  (SDPUtils.writeSessionBoilerplate = function(
                    sessId,
                    sessVer
                  ) {
                    var version = void 0 !== sessVer ? sessVer : 2;
                    return (
                      'v=0\r\no=thisisadapterortc ' +
                      (sessId || SDPUtils.generateSessionId()) +
                      ' ' +
                      version +
                      ' IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n'
                    );
                  }),
                  (SDPUtils.writeMediaSection = function(
                    transceiver,
                    caps,
                    type,
                    stream
                  ) {
                    var sdp = SDPUtils.writeRtpDescription(
                      transceiver.kind,
                      caps
                    );
                    if (
                      ((sdp += SDPUtils.writeIceParameters(
                        transceiver.iceGatherer.getLocalParameters()
                      )),
                      (sdp += SDPUtils.writeDtlsParameters(
                        transceiver.dtlsTransport.getLocalParameters(),
                        'offer' === type ? 'actpass' : 'active'
                      )),
                      (sdp += 'a=mid:' + transceiver.mid + '\r\n'),
                      transceiver.direction
                        ? (sdp += 'a=' + transceiver.direction + '\r\n')
                        : transceiver.rtpSender && transceiver.rtpReceiver
                          ? (sdp += 'a=sendrecv\r\n')
                          : transceiver.rtpSender
                            ? (sdp += 'a=sendonly\r\n')
                            : transceiver.rtpReceiver
                              ? (sdp += 'a=recvonly\r\n')
                              : (sdp += 'a=inactive\r\n'),
                      transceiver.rtpSender)
                    ) {
                      var msid =
                        'msid:' +
                        stream.id +
                        ' ' +
                        transceiver.rtpSender.track.id +
                        '\r\n';
                      (sdp += 'a=' + msid),
                        (sdp +=
                          'a=ssrc:' +
                          transceiver.sendEncodingParameters[0].ssrc +
                          ' ' +
                          msid),
                        transceiver.sendEncodingParameters[0].rtx &&
                          ((sdp +=
                            'a=ssrc:' +
                            transceiver.sendEncodingParameters[0].rtx.ssrc +
                            ' ' +
                            msid),
                          (sdp +=
                            'a=ssrc-group:FID ' +
                            transceiver.sendEncodingParameters[0].ssrc +
                            ' ' +
                            transceiver.sendEncodingParameters[0].rtx.ssrc +
                            '\r\n'));
                    }
                    return (
                      (sdp +=
                        'a=ssrc:' +
                        transceiver.sendEncodingParameters[0].ssrc +
                        ' cname:' +
                        SDPUtils.localCName +
                        '\r\n'),
                      transceiver.rtpSender &&
                        transceiver.sendEncodingParameters[0].rtx &&
                        (sdp +=
                          'a=ssrc:' +
                          transceiver.sendEncodingParameters[0].rtx.ssrc +
                          ' cname:' +
                          SDPUtils.localCName +
                          '\r\n'),
                      sdp
                    );
                  }),
                  (SDPUtils.getDirection = function(mediaSection, sessionpart) {
                    for (
                      var lines = SDPUtils.splitLines(mediaSection), i = 0;
                      i < lines.length;
                      i++
                    )
                      switch (lines[i]) {
                        case 'a=sendrecv':
                        case 'a=sendonly':
                        case 'a=recvonly':
                        case 'a=inactive':
                          return lines[i].substr(2);
                      }
                    return sessionpart
                      ? SDPUtils.getDirection(sessionpart)
                      : 'sendrecv';
                  }),
                  (SDPUtils.getKind = function(mediaSection) {
                    return SDPUtils.splitLines(mediaSection)[0]
                      .split(' ')[0]
                      .substr(2);
                  }),
                  (SDPUtils.isRejected = function(mediaSection) {
                    return '0' === mediaSection.split(' ', 2)[1];
                  }),
                  (module.exports = SDPUtils);
              },
              {}
            ],
            3: [
              function(requirecopy, module, exports) {
                (function(global) {
                  'use strict';
                  var adapterFactory = requirecopy('./adapter_factory.js');
                  module.exports = adapterFactory({ window: global.window });
                }.call(
                  this,
                  'undefined' != typeof global
                    ? global
                    : 'undefined' != typeof self
                      ? self
                      : 'undefined' != typeof window
                        ? window
                        : {}
                ));
              },
              { './adapter_factory.js': 4 }
            ],
            4: [
              function(requirecopy, module, exports) {
                'use strict';
                module.exports = function(dependencies, opts) {
                  var window = dependencies && dependencies.window,
                    options = {
                      shimChrome: !0,
                      shimFirefox: !0,
                      shimEdge: !0,
                      shimSafari: !0
                    };
                  for (var key in opts)
                    hasOwnProperty.call(opts, key) &&
                      (options[key] = opts[key]);
                  var utils = requirecopy('./utils'),
                    logging = utils.log,
                    browserDetails = utils.detectBrowser(window),
                    adapter = {
                      browserDetails: browserDetails,
                      extractVersion: utils.extractVersion,
                      disableLog: utils.disableLog,
                      disableWarnings: utils.disableWarnings
                    },
                    chromeShim = requirecopy('./chrome/chrome_shim') || null,
                    edgeShim = requirecopy('./edge/edge_shim') || null,
                    firefoxShim = requirecopy('./firefox/firefox_shim') || null,
                    safariShim = requirecopy('./safari/safari_shim') || null,
                    commonShim = requirecopy('./common_shim') || null;
                  switch (browserDetails.browser) {
                    case 'chrome':
                      if (
                        !chromeShim ||
                        !chromeShim.shimPeerConnection ||
                        !options.shimChrome
                      )
                        return (
                          logging(
                            'Chrome shim is not included in this adapter release.'
                          ),
                          adapter
                        );
                      logging('adapter.js shimming chrome.'),
                        (adapter.browserShim = chromeShim),
                        chromeShim.shimGetUserMedia(window),
                        chromeShim.shimMediaStream(window),
                        utils.shimCreateObjectURL(window),
                        chromeShim.shimSourceObject(window),
                        chromeShim.shimPeerConnection(window),
                        chromeShim.shimOnTrack(window),
                        chromeShim.shimAddTrackRemoveTrack(window),
                        chromeShim.shimGetSendersWithDtmf(window),
                        commonShim.shimRTCIceCandidate(window);
                      break;
                    case 'firefox':
                      if (
                        !firefoxShim ||
                        !firefoxShim.shimPeerConnection ||
                        !options.shimFirefox
                      )
                        return (
                          logging(
                            'Firefox shim is not included in this adapter release.'
                          ),
                          adapter
                        );
                      logging('adapter.js shimming firefox.'),
                        (adapter.browserShim = firefoxShim),
                        firefoxShim.shimGetUserMedia(window),
                        utils.shimCreateObjectURL(window),
                        firefoxShim.shimSourceObject(window),
                        firefoxShim.shimPeerConnection(window),
                        firefoxShim.shimOnTrack(window),
                        commonShim.shimRTCIceCandidate(window);
                      break;
                    case 'edge':
                      if (
                        !edgeShim ||
                        !edgeShim.shimPeerConnection ||
                        !options.shimEdge
                      )
                        return (
                          logging(
                            'MS edge shim is not included in this adapter release.'
                          ),
                          adapter
                        );
                      logging('adapter.js shimming edge.'),
                        (adapter.browserShim = edgeShim),
                        edgeShim.shimGetUserMedia(window),
                        utils.shimCreateObjectURL(window),
                        edgeShim.shimPeerConnection(window),
                        edgeShim.shimReplaceTrack(window);
                      break;
                    case 'safari':
                      if (!safariShim || !options.shimSafari)
                        return (
                          logging(
                            'Safari shim is not included in this adapter release.'
                          ),
                          adapter
                        );
                      logging('adapter.js shimming safari.'),
                        (adapter.browserShim = safariShim),
                        utils.shimCreateObjectURL(window),
                        safariShim.shimRTCIceServerUrls(window),
                        safariShim.shimCallbacksAPI(window),
                        safariShim.shimLocalStreamsAPI(window),
                        safariShim.shimRemoteStreamsAPI(window),
                        safariShim.shimTrackEventTransceiver(window),
                        safariShim.shimGetUserMedia(window),
                        commonShim.shimRTCIceCandidate(window);
                      break;
                    default:
                      logging('Unsupported browser!');
                  }
                  return adapter;
                };
              },
              {
                './chrome/chrome_shim': 5,
                './common_shim': 7,
                './edge/edge_shim': 8,
                './firefox/firefox_shim': 10,
                './safari/safari_shim': 12,
                './utils': 13
              }
            ],
            5: [
              function(requirecopy, module, exports) {
                'use strict';
                var utils = requirecopy('../utils.js'),
                  logging = utils.log,
                  chromeShim = {
                    shimMediaStream: function(window) {
                      window.MediaStream =
                        window.MediaStream || window.webkitMediaStream;
                    },
                    shimOnTrack: function(window) {
                      if (
                        'object' == typeof window &&
                        window.RTCPeerConnection &&
                        !('ontrack' in window.RTCPeerConnection.prototype)
                      ) {
                        Object.defineProperty(
                          window.RTCPeerConnection.prototype,
                          'ontrack',
                          {
                            get: function() {
                              return this._ontrack;
                            },
                            set: function(f) {
                              this._ontrack &&
                                this.removeEventListener(
                                  'track',
                                  this._ontrack
                                ),
                                this.addEventListener(
                                  'track',
                                  (this._ontrack = f)
                                );
                            }
                          }
                        );
                        var origSetRemoteDescription =
                          window.RTCPeerConnection.prototype
                            .setRemoteDescription;
                        window.RTCPeerConnection.prototype.setRemoteDescription = function() {
                          var pc = this;
                          return (
                            pc._ontrackpoly ||
                              ((pc._ontrackpoly = function(e) {
                                e.stream.addEventListener('addtrack', function(
                                  te
                                ) {
                                  var receiver;
                                  receiver = window.RTCPeerConnection.prototype
                                    .getReceivers
                                    ? pc.getReceivers().find(function(r) {
                                        return (
                                          r.track && r.track.id === te.track.id
                                        );
                                      })
                                    : { track: te.track };
                                  var event = new Event('track');
                                  (event.track = te.track),
                                    (event.receiver = receiver),
                                    (event.transceiver = {
                                      receiver: receiver
                                    }),
                                    (event.streams = [e.stream]),
                                    pc.dispatchEvent(event);
                                }),
                                  e.stream.getTracks().forEach(function(track) {
                                    var receiver;
                                    receiver = window.RTCPeerConnection
                                      .prototype.getReceivers
                                      ? pc.getReceivers().find(function(r) {
                                          return (
                                            r.track && r.track.id === track.id
                                          );
                                        })
                                      : { track: track };
                                    var event = new Event('track');
                                    (event.track = track),
                                      (event.receiver = receiver),
                                      (event.transceiver = {
                                        receiver: receiver
                                      }),
                                      (event.streams = [e.stream]),
                                      pc.dispatchEvent(event);
                                  });
                              }),
                              pc.addEventListener(
                                'addstream',
                                pc._ontrackpoly
                              )),
                            origSetRemoteDescription.apply(pc, arguments)
                          );
                        };
                      }
                    },
                    shimGetSendersWithDtmf: function(window) {
                      if (
                        'object' == typeof window &&
                        window.RTCPeerConnection &&
                        !('getSenders' in window.RTCPeerConnection.prototype) &&
                        'createDTMFSender' in window.RTCPeerConnection.prototype
                      ) {
                        var shimSenderWithDtmf = function(pc, track) {
                          return {
                            track: track,
                            get dtmf() {
                              return (
                                void 0 === this._dtmf &&
                                  ('audio' === track.kind
                                    ? (this._dtmf = pc.createDTMFSender(track))
                                    : (this._dtmf = null)),
                                this._dtmf
                              );
                            },
                            _pc: pc
                          };
                        };
                        if (!window.RTCPeerConnection.prototype.getSenders) {
                          window.RTCPeerConnection.prototype.getSenders = function() {
                            return (
                              (this._senders = this._senders || []),
                              this._senders.slice()
                            );
                          };
                          var origAddTrack =
                            window.RTCPeerConnection.prototype.addTrack;
                          window.RTCPeerConnection.prototype.addTrack = function(
                            track,
                            stream
                          ) {
                            var pc = this,
                              sender = origAddTrack.apply(pc, arguments);
                            return (
                              sender ||
                                ((sender = shimSenderWithDtmf(pc, track)),
                                pc._senders.push(sender)),
                              sender
                            );
                          };
                          var origRemoveTrack =
                            window.RTCPeerConnection.prototype.removeTrack;
                          window.RTCPeerConnection.prototype.removeTrack = function(
                            sender
                          ) {
                            var pc = this;
                            origRemoveTrack.apply(pc, arguments);
                            var idx = pc._senders.indexOf(sender);
                            -1 !== idx && pc._senders.splice(idx, 1);
                          };
                        }
                        var origAddStream =
                          window.RTCPeerConnection.prototype.addStream;
                        window.RTCPeerConnection.prototype.addStream = function(
                          stream
                        ) {
                          var pc = this;
                          (pc._senders = pc._senders || []),
                            origAddStream.apply(pc, [stream]),
                            stream.getTracks().forEach(function(track) {
                              pc._senders.push(shimSenderWithDtmf(pc, track));
                            });
                        };
                        var origRemoveStream =
                          window.RTCPeerConnection.prototype.removeStream;
                        window.RTCPeerConnection.prototype.removeStream = function(
                          stream
                        ) {
                          var pc = this;
                          (pc._senders = pc._senders || []),
                            origRemoveStream.apply(pc, [
                              pc._streams[stream.id] || stream
                            ]),
                            stream.getTracks().forEach(function(track) {
                              var sender = pc._senders.find(function(s) {
                                return s.track === track;
                              });
                              sender &&
                                pc._senders.splice(
                                  pc._senders.indexOf(sender),
                                  1
                                );
                            });
                        };
                      } else if (
                        'object' == typeof window &&
                        window.RTCPeerConnection &&
                        'getSenders' in window.RTCPeerConnection.prototype &&
                        'createDTMFSender' in
                          window.RTCPeerConnection.prototype &&
                        window.RTCRtpSender &&
                        !('dtmf' in window.RTCRtpSender.prototype)
                      ) {
                        var origGetSenders =
                          window.RTCPeerConnection.prototype.getSenders;
                        (window.RTCPeerConnection.prototype.getSenders = function() {
                          var pc = this,
                            senders = origGetSenders.apply(pc, []);
                          return (
                            senders.forEach(function(sender) {
                              sender._pc = pc;
                            }),
                            senders
                          );
                        }),
                          Object.defineProperty(
                            window.RTCRtpSender.prototype,
                            'dtmf',
                            {
                              get: function() {
                                return (
                                  void 0 === this._dtmf &&
                                    ('audio' === this.track.kind
                                      ? (this._dtmf = this._pc.createDTMFSender(
                                          this.track
                                        ))
                                      : (this._dtmf = null)),
                                  this._dtmf
                                );
                              }
                            }
                          );
                      }
                    },
                    shimSourceObject: function(window) {
                      var URL = window && window.URL;
                      'object' == typeof window &&
                        (!window.HTMLMediaElement ||
                          'srcObject' in window.HTMLMediaElement.prototype ||
                          Object.defineProperty(
                            window.HTMLMediaElement.prototype,
                            'srcObject',
                            {
                              get: function() {
                                return this._srcObject;
                              },
                              set: function(stream) {
                                var self = this;
                                if (
                                  ((this._srcObject = stream),
                                  this.src && URL.revokeObjectURL(this.src),
                                  !stream)
                                )
                                  return void (this.src = '');
                                (this.src = URL.createObjectURL(stream)),
                                  stream.addEventListener(
                                    'addtrack',
                                    function() {
                                      self.src && URL.revokeObjectURL(self.src),
                                        (self.src = URL.createObjectURL(
                                          stream
                                        ));
                                    }
                                  ),
                                  stream.addEventListener(
                                    'removetrack',
                                    function() {
                                      self.src && URL.revokeObjectURL(self.src),
                                        (self.src = URL.createObjectURL(
                                          stream
                                        ));
                                    }
                                  );
                              }
                            }
                          ));
                    },
                    shimAddTrackRemoveTrack: function(window) {
                      function replaceInternalStreamId(pc, description) {
                        var sdp = description.sdp;
                        return (
                          Object.keys(pc._reverseStreams || []).forEach(
                            function(internalId) {
                              var externalStream =
                                  pc._reverseStreams[internalId],
                                internalStream = pc._streams[externalStream.id];
                              sdp = sdp.replace(
                                new RegExp(internalStream.id, 'g'),
                                externalStream.id
                              );
                            }
                          ),
                          new RTCSessionDescription({
                            type: description.type,
                            sdp: sdp
                          })
                        );
                      }
                      function replaceExternalStreamId(pc, description) {
                        var sdp = description.sdp;
                        return (
                          Object.keys(pc._reverseStreams || []).forEach(
                            function(internalId) {
                              var externalStream =
                                  pc._reverseStreams[internalId],
                                internalStream = pc._streams[externalStream.id];
                              sdp = sdp.replace(
                                new RegExp(externalStream.id, 'g'),
                                internalStream.id
                              );
                            }
                          ),
                          new RTCSessionDescription({
                            type: description.type,
                            sdp: sdp
                          })
                        );
                      }
                      if (!window.RTCPeerConnection.prototype.addTrack) {
                        var origGetLocalStreams =
                          window.RTCPeerConnection.prototype.getLocalStreams;
                        window.RTCPeerConnection.prototype.getLocalStreams = function() {
                          var self = this,
                            nativeStreams = origGetLocalStreams.apply(this);
                          return (
                            (self._reverseStreams = self._reverseStreams || {}),
                            nativeStreams.map(function(stream) {
                              return self._reverseStreams[stream.id];
                            })
                          );
                        };
                        var origAddStream =
                          window.RTCPeerConnection.prototype.addStream;
                        window.RTCPeerConnection.prototype.addStream = function(
                          stream
                        ) {
                          var pc = this;
                          if (
                            ((pc._streams = pc._streams || {}),
                            (pc._reverseStreams = pc._reverseStreams || {}),
                            stream.getTracks().forEach(function(track) {
                              if (
                                pc.getSenders().find(function(s) {
                                  return s.track === track;
                                })
                              )
                                throw new DOMException(
                                  'Track already exists.',
                                  'InvalidAccessError'
                                );
                            }),
                            !pc._reverseStreams[stream.id])
                          ) {
                            var newStream = new window.MediaStream(
                              stream.getTracks()
                            );
                            (pc._streams[stream.id] = newStream),
                              (pc._reverseStreams[newStream.id] = stream),
                              (stream = newStream);
                          }
                          origAddStream.apply(pc, [stream]);
                        };
                        var origRemoveStream =
                          window.RTCPeerConnection.prototype.removeStream;
                        (window.RTCPeerConnection.prototype.removeStream = function(
                          stream
                        ) {
                          var pc = this;
                          (pc._streams = pc._streams || {}),
                            (pc._reverseStreams = pc._reverseStreams || {}),
                            origRemoveStream.apply(pc, [
                              pc._streams[stream.id] || stream
                            ]),
                            delete pc._reverseStreams[
                              pc._streams[stream.id]
                                ? pc._streams[stream.id].id
                                : stream.id
                            ],
                            delete pc._streams[stream.id];
                        }),
                          (window.RTCPeerConnection.prototype.addTrack = function(
                            track,
                            stream
                          ) {
                            var pc = this;
                            if ('closed' === pc.signalingState)
                              throw new DOMException(
                                "The RTCPeerConnection's signalingState is 'closed'.",
                                'InvalidStateError'
                              );
                            var streams = [].slice.call(arguments, 1);
                            if (
                              1 !== streams.length ||
                              !streams[0].getTracks().find(function(t) {
                                return t === track;
                              })
                            )
                              throw new DOMException(
                                'The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.',
                                'NotSupportedError'
                              );
                            if (
                              pc.getSenders().find(function(s) {
                                return s.track === track;
                              })
                            )
                              throw new DOMException(
                                'Track already exists.',
                                'InvalidAccessError'
                              );
                            (pc._streams = pc._streams || {}),
                              (pc._reverseStreams = pc._reverseStreams || {});
                            var oldStream = pc._streams[stream.id];
                            if (oldStream)
                              oldStream.addTrack(track),
                                Promise.resolve().then(function() {
                                  pc.dispatchEvent(
                                    new Event('negotiationneeded')
                                  );
                                });
                            else {
                              var newStream = new window.MediaStream([track]);
                              (pc._streams[stream.id] = newStream),
                                (pc._reverseStreams[newStream.id] = stream),
                                pc.addStream(newStream);
                            }
                            return pc.getSenders().find(function(s) {
                              return s.track === track;
                            });
                          }),
                          ['createOffer', 'createAnswer'].forEach(function(
                            method
                          ) {
                            var nativeMethod =
                              window.RTCPeerConnection.prototype[method];
                            window.RTCPeerConnection.prototype[
                              method
                            ] = function() {
                              var pc = this,
                                args = arguments;
                              return arguments.length &&
                                'function' == typeof arguments[0]
                                ? nativeMethod.apply(pc, [
                                    function(description) {
                                      var desc = replaceInternalStreamId(
                                        pc,
                                        description
                                      );
                                      args[0].apply(null, [desc]);
                                    },
                                    function(err) {
                                      args[1] && args[1].apply(null, err);
                                    },
                                    arguments[2]
                                  ])
                                : nativeMethod
                                    .apply(pc, arguments)
                                    .then(function(description) {
                                      return replaceInternalStreamId(
                                        pc,
                                        description
                                      );
                                    });
                            };
                          });
                        var origSetLocalDescription =
                          window.RTCPeerConnection.prototype
                            .setLocalDescription;
                        window.RTCPeerConnection.prototype.setLocalDescription = function() {
                          var pc = this;
                          return arguments.length && arguments[0].type
                            ? ((arguments[0] = replaceExternalStreamId(
                                pc,
                                arguments[0]
                              )),
                              origSetLocalDescription.apply(pc, arguments))
                            : origSetLocalDescription.apply(pc, arguments);
                        };
                        var origLocalDescription = Object.getOwnPropertyDescriptor(
                          window.RTCPeerConnection.prototype,
                          'localDescription'
                        );
                        Object.defineProperty(
                          window.RTCPeerConnection.prototype,
                          'localDescription',
                          {
                            get: function() {
                              var pc = this,
                                description = origLocalDescription.get.apply(
                                  this
                                );
                              return '' === description.type
                                ? description
                                : replaceInternalStreamId(pc, description);
                            }
                          }
                        ),
                          (window.RTCPeerConnection.prototype.removeTrack = function(
                            sender
                          ) {
                            var pc = this;
                            if ('closed' === pc.signalingState)
                              throw new DOMException(
                                "The RTCPeerConnection's signalingState is 'closed'.",
                                'InvalidStateError'
                              );
                            if (!sender._pc)
                              throw new DOMException(
                                'Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.',
                                'TypeError'
                              );
                            if (sender._pc !== pc)
                              throw new DOMException(
                                'Sender was not created by this connection.',
                                'InvalidAccessError'
                              );
                            pc._streams = pc._streams || {};
                            var stream;
                            Object.keys(pc._streams).forEach(function(
                              streamid
                            ) {
                              pc._streams[streamid]
                                .getTracks()
                                .find(function(track) {
                                  return sender.track === track;
                                }) && (stream = pc._streams[streamid]);
                            }),
                              stream &&
                                (1 === stream.getTracks().length
                                  ? pc.removeStream(stream)
                                  : stream.removeTrack(sender.track),
                                pc.dispatchEvent(
                                  new Event('negotiationneeded')
                                ));
                          });
                      }
                    },
                    shimPeerConnection: function(window) {
                      var browserDetails = utils.detectBrowser(window);
                      if (window.RTCPeerConnection) {
                        var OrigPeerConnection = window.RTCPeerConnection;
                        (window.RTCPeerConnection = function(
                          pcConfig,
                          pcConstraints
                        ) {
                          if (pcConfig && pcConfig.iceServers) {
                            for (
                              var newIceServers = [], i = 0;
                              i < pcConfig.iceServers.length;
                              i++
                            ) {
                              var server = pcConfig.iceServers[i];
                              !server.hasOwnProperty('urls') &&
                              server.hasOwnProperty('url')
                                ? (utils.deprecated(
                                    'RTCIceServer.url',
                                    'RTCIceServer.urls'
                                  ),
                                  (server = JSON.parse(JSON.stringify(server))),
                                  (server.urls = server.url),
                                  newIceServers.push(server))
                                : newIceServers.push(pcConfig.iceServers[i]);
                            }
                            pcConfig.iceServers = newIceServers;
                          }
                          return new OrigPeerConnection(
                            pcConfig,
                            pcConstraints
                          );
                        }),
                          (window.RTCPeerConnection.prototype =
                            OrigPeerConnection.prototype),
                          Object.defineProperty(
                            window.RTCPeerConnection,
                            'generateCertificate',
                            {
                              get: function() {
                                return OrigPeerConnection.generateCertificate;
                              }
                            }
                          );
                      } else
                        (window.RTCPeerConnection = function(
                          pcConfig,
                          pcConstraints
                        ) {
                          return (
                            logging('PeerConnection'),
                            pcConfig &&
                              pcConfig.iceTransportPolicy &&
                              (pcConfig.iceTransports =
                                pcConfig.iceTransportPolicy),
                            new window.webkitRTCPeerConnection(
                              pcConfig,
                              pcConstraints
                            )
                          );
                        }),
                          (window.RTCPeerConnection.prototype =
                            window.webkitRTCPeerConnection.prototype),
                          window.webkitRTCPeerConnection.generateCertificate &&
                            Object.defineProperty(
                              window.RTCPeerConnection,
                              'generateCertificate',
                              {
                                get: function() {
                                  return window.webkitRTCPeerConnection
                                    .generateCertificate;
                                }
                              }
                            );
                      var origGetStats =
                        window.RTCPeerConnection.prototype.getStats;
                      (window.RTCPeerConnection.prototype.getStats = function(
                        selector,
                        successCallback,
                        errorCallback
                      ) {
                        var self = this,
                          args = arguments;
                        if (
                          arguments.length > 0 &&
                          'function' == typeof selector
                        )
                          return origGetStats.apply(this, arguments);
                        if (
                          0 === origGetStats.length &&
                          (0 === arguments.length ||
                            'function' != typeof arguments[0])
                        )
                          return origGetStats.apply(this, []);
                        var fixChromeStats_ = function(response) {
                            var standardReport = {};
                            return (
                              response.result().forEach(function(report) {
                                var standardStats = {
                                  id: report.id,
                                  timestamp: report.timestamp,
                                  type:
                                    {
                                      localcandidate: 'local-candidate',
                                      remotecandidate: 'remote-candidate'
                                    }[report.type] || report.type
                                };
                                report.names().forEach(function(name) {
                                  standardStats[name] = report.stat(name);
                                }),
                                  (standardReport[
                                    standardStats.id
                                  ] = standardStats);
                              }),
                              standardReport
                            );
                          },
                          makeMapStats = function(stats) {
                            return new Map(
                              Object.keys(stats).map(function(key) {
                                return [key, stats[key]];
                              })
                            );
                          };
                        if (arguments.length >= 2) {
                          var successCallbackWrapper_ = function(response) {
                            args[1](makeMapStats(fixChromeStats_(response)));
                          };
                          return origGetStats.apply(this, [
                            successCallbackWrapper_,
                            arguments[0]
                          ]);
                        }
                        return new Promise(function(resolve, reject) {
                          origGetStats.apply(self, [
                            function(response) {
                              resolve(makeMapStats(fixChromeStats_(response)));
                            },
                            reject
                          ]);
                        }).then(successCallback, errorCallback);
                      }),
                        browserDetails.version < 51 &&
                          [
                            'setLocalDescription',
                            'setRemoteDescription',
                            'addIceCandidate'
                          ].forEach(function(method) {
                            var nativeMethod =
                              window.RTCPeerConnection.prototype[method];
                            window.RTCPeerConnection.prototype[
                              method
                            ] = function() {
                              var args = arguments,
                                self = this,
                                promise = new Promise(function(
                                  resolve,
                                  reject
                                ) {
                                  nativeMethod.apply(self, [
                                    args[0],
                                    resolve,
                                    reject
                                  ]);
                                });
                              return args.length < 2
                                ? promise
                                : promise.then(
                                    function() {
                                      args[1].apply(null, []);
                                    },
                                    function(err) {
                                      args.length >= 3 &&
                                        args[2].apply(null, [err]);
                                    }
                                  );
                            };
                          }),
                        browserDetails.version < 52 &&
                          ['createOffer', 'createAnswer'].forEach(function(
                            method
                          ) {
                            var nativeMethod =
                              window.RTCPeerConnection.prototype[method];
                            window.RTCPeerConnection.prototype[
                              method
                            ] = function() {
                              var self = this;
                              if (
                                arguments.length < 1 ||
                                (1 === arguments.length &&
                                  'object' == typeof arguments[0])
                              ) {
                                var opts =
                                  1 === arguments.length
                                    ? arguments[0]
                                    : void 0;
                                return new Promise(function(resolve, reject) {
                                  nativeMethod.apply(self, [
                                    resolve,
                                    reject,
                                    opts
                                  ]);
                                });
                              }
                              return nativeMethod.apply(this, arguments);
                            };
                          }),
                        [
                          'setLocalDescription',
                          'setRemoteDescription',
                          'addIceCandidate'
                        ].forEach(function(method) {
                          var nativeMethod =
                            window.RTCPeerConnection.prototype[method];
                          window.RTCPeerConnection.prototype[
                            method
                          ] = function() {
                            return (
                              (arguments[0] = new ('addIceCandidate' === method
                                ? window.RTCIceCandidate
                                : window.RTCSessionDescription)(arguments[0])),
                              nativeMethod.apply(this, arguments)
                            );
                          };
                        });
                      var nativeAddIceCandidate =
                        window.RTCPeerConnection.prototype.addIceCandidate;
                      window.RTCPeerConnection.prototype.addIceCandidate = function() {
                        return arguments[0]
                          ? nativeAddIceCandidate.apply(this, arguments)
                          : (arguments[1] && arguments[1].apply(null),
                            Promise.resolve());
                      };
                    }
                  };
                module.exports = {
                  shimMediaStream: chromeShim.shimMediaStream,
                  shimOnTrack: chromeShim.shimOnTrack,
                  shimAddTrackRemoveTrack: chromeShim.shimAddTrackRemoveTrack,
                  shimGetSendersWithDtmf: chromeShim.shimGetSendersWithDtmf,
                  shimSourceObject: chromeShim.shimSourceObject,
                  shimPeerConnection: chromeShim.shimPeerConnection,
                  shimGetUserMedia: requirecopy('./getusermedia')
                };
              },
              { '../utils.js': 13, './getusermedia': 6 }
            ],
            6: [
              function(requirecopy, module, exports) {
                'use strict';
                var utils = requirecopy('../utils.js'),
                  logging = utils.log;
                module.exports = function(window) {
                  var browserDetails = utils.detectBrowser(window),
                    navigator = window && window.navigator,
                    constraintsToChrome_ = function(c) {
                      if ('object' != typeof c || c.mandatory || c.optional)
                        return c;
                      var cc = {};
                      return (
                        Object.keys(c).forEach(function(key) {
                          if (
                            'require' !== key &&
                            'advanced' !== key &&
                            'mediaSource' !== key
                          ) {
                            var r =
                              'object' == typeof c[key]
                                ? c[key]
                                : { ideal: c[key] };
                            void 0 !== r.exact &&
                              'number' == typeof r.exact &&
                              (r.min = r.max = r.exact);
                            var oldname_ = function(prefix, name) {
                              return prefix
                                ? prefix +
                                    name.charAt(0).toUpperCase() +
                                    name.slice(1)
                                : 'deviceId' === name
                                  ? 'sourceId'
                                  : name;
                            };
                            if (void 0 !== r.ideal) {
                              cc.optional = cc.optional || [];
                              var oc = {};
                              'number' == typeof r.ideal
                                ? ((oc[oldname_('min', key)] = r.ideal),
                                  cc.optional.push(oc),
                                  (oc = {}),
                                  (oc[oldname_('max', key)] = r.ideal),
                                  cc.optional.push(oc))
                                : ((oc[oldname_('', key)] = r.ideal),
                                  cc.optional.push(oc));
                            }
                            void 0 !== r.exact && 'number' != typeof r.exact
                              ? ((cc.mandatory = cc.mandatory || {}),
                                (cc.mandatory[oldname_('', key)] = r.exact))
                              : ['min', 'max'].forEach(function(mix) {
                                  void 0 !== r[mix] &&
                                    ((cc.mandatory = cc.mandatory || {}),
                                    (cc.mandatory[oldname_(mix, key)] =
                                      r[mix]));
                                });
                          }
                        }),
                        c.advanced &&
                          (cc.optional = (cc.optional || []).concat(
                            c.advanced
                          )),
                        cc
                      );
                    },
                    shimConstraints_ = function(constraints, func) {
                      if (
                        (constraints = JSON.parse(
                          JSON.stringify(constraints)
                        )) &&
                        'object' == typeof constraints.audio
                      ) {
                        var remap = function(obj, a, b) {
                          a in obj &&
                            !(b in obj) &&
                            ((obj[b] = obj[a]), delete obj[a]);
                        };
                        (constraints = JSON.parse(JSON.stringify(constraints))),
                          remap(
                            constraints.audio,
                            'autoGainControl',
                            'googAutoGainControl'
                          ),
                          remap(
                            constraints.audio,
                            'noiseSuppression',
                            'googNoiseSuppression'
                          ),
                          (constraints.audio = constraintsToChrome_(
                            constraints.audio
                          ));
                      }
                      if (constraints && 'object' == typeof constraints.video) {
                        var face = constraints.video.facingMode;
                        face =
                          face &&
                          ('object' == typeof face ? face : { ideal: face });
                        var getSupportedFacingModeLies =
                          browserDetails.version < 61;
                        if (
                          face &&
                          ('user' === face.exact ||
                            'environment' === face.exact ||
                            'user' === face.ideal ||
                            'environment' === face.ideal) &&
                          (!navigator.mediaDevices.getSupportedConstraints ||
                            !navigator.mediaDevices.getSupportedConstraints()
                              .facingMode ||
                            getSupportedFacingModeLies)
                        ) {
                          delete constraints.video.facingMode;
                          var matches;
                          if (
                            ('environment' === face.exact ||
                            'environment' === face.ideal
                              ? (matches = ['back', 'rear'])
                              : ('user' !== face.exact &&
                                  'user' !== face.ideal) ||
                                (matches = ['front']),
                            matches)
                          )
                            return navigator.mediaDevices
                              .enumerateDevices()
                              .then(function(devices) {
                                devices = devices.filter(function(d) {
                                  return 'videoinput' === d.kind;
                                });
                                var dev = devices.find(function(d) {
                                  return matches.some(function(match) {
                                    return (
                                      -1 !==
                                      d.label.toLowerCase().indexOf(match)
                                    );
                                  });
                                });
                                return (
                                  !dev &&
                                    devices.length &&
                                    -1 !== matches.indexOf('back') &&
                                    (dev = devices[devices.length - 1]),
                                  dev &&
                                    (constraints.video.deviceId = face.exact
                                      ? { exact: dev.deviceId }
                                      : { ideal: dev.deviceId }),
                                  (constraints.video = constraintsToChrome_(
                                    constraints.video
                                  )),
                                  logging(
                                    'chrome: ' + JSON.stringify(constraints)
                                  ),
                                  func(constraints)
                                );
                              });
                        }
                        constraints.video = constraintsToChrome_(
                          constraints.video
                        );
                      }
                      return (
                        logging('chrome: ' + JSON.stringify(constraints)),
                        func(constraints)
                      );
                    },
                    shimError_ = function(e) {
                      return {
                        name:
                          {
                            PermissionDeniedError: 'NotAllowedError',
                            InvalidStateError: 'NotReadableError',
                            DevicesNotFoundError: 'NotFoundError',
                            ConstraintNotSatisfiedError: 'OverconstrainedError',
                            TrackStartError: 'NotReadableError',
                            MediaDeviceFailedDueToShutdown: 'NotReadableError',
                            MediaDeviceKillSwitchOn: 'NotReadableError'
                          }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraintName,
                        toString: function() {
                          return (
                            this.name + (this.message && ': ') + this.message
                          );
                        }
                      };
                    },
                    getUserMedia_ = function(constraints, onSuccess, onError) {
                      shimConstraints_(constraints, function(c) {
                        navigator.webkitGetUserMedia(c, onSuccess, function(e) {
                          onError && onError(shimError_(e));
                        });
                      });
                    };
                  navigator.getUserMedia = getUserMedia_;
                  var getUserMediaPromise_ = function(constraints) {
                    return new Promise(function(resolve, reject) {
                      navigator.getUserMedia(constraints, resolve, reject);
                    });
                  };
                  if (
                    (navigator.mediaDevices ||
                      (navigator.mediaDevices = {
                        getUserMedia: getUserMediaPromise_,
                        enumerateDevices: function() {
                          return new Promise(function(resolve) {
                            var kinds = {
                              audio: 'audioinput',
                              video: 'videoinput'
                            };
                            return window.MediaStreamTrack.getSources(function(
                              devices
                            ) {
                              resolve(
                                devices.map(function(device) {
                                  return {
                                    label: device.label,
                                    kind: kinds[device.kind],
                                    deviceId: device.id,
                                    groupId: ''
                                  };
                                })
                              );
                            });
                          });
                        },
                        getSupportedConstraints: function() {
                          return {
                            deviceId: !0,
                            echoCancellation: !0,
                            facingMode: !0,
                            frameRate: !0,
                            height: !0,
                            width: !0
                          };
                        }
                      }),
                    navigator.mediaDevices.getUserMedia)
                  ) {
                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
                      navigator.mediaDevices
                    );
                    navigator.mediaDevices.getUserMedia = function(cs) {
                      return shimConstraints_(cs, function(c) {
                        return origGetUserMedia(c).then(
                          function(stream) {
                            if (
                              (c.audio && !stream.getAudioTracks().length) ||
                              (c.video && !stream.getVideoTracks().length)
                            )
                              throw (stream
                                .getTracks()
                                .forEach(function(track) {
                                  track.stop();
                                }),
                              new DOMException('', 'NotFoundError'));
                            return stream;
                          },
                          function(e) {
                            return Promise.reject(shimError_(e));
                          }
                        );
                      });
                    };
                  } else
                    navigator.mediaDevices.getUserMedia = function(
                      constraints
                    ) {
                      return getUserMediaPromise_(constraints);
                    };
                  void 0 === navigator.mediaDevices.addEventListener &&
                    (navigator.mediaDevices.addEventListener = function() {
                      logging('Dummy mediaDevices.addEventListener called.');
                    }),
                    void 0 === navigator.mediaDevices.removeEventListener &&
                      (navigator.mediaDevices.removeEventListener = function() {
                        logging(
                          'Dummy mediaDevices.removeEventListener called.'
                        );
                      });
                };
              },
              { '../utils.js': 13 }
            ],
            7: [
              function(requirecopy, module, exports) {
                'use strict';
                function wrapPeerConnectionEvent(
                  window,
                  eventNameToWrap,
                  wrapper
                ) {
                  if (window.RTCPeerConnection) {
                    var proto = window.RTCPeerConnection.prototype,
                      nativeAddEventListener = proto.addEventListener;
                    proto.addEventListener = function(nativeEventName, cb) {
                      if (nativeEventName !== eventNameToWrap)
                        return nativeAddEventListener.apply(this, arguments);
                      var wrappedCallback = function(e) {
                        cb(wrapper(e));
                      };
                      return (
                        (this._eventMap = this._eventMap || {}),
                        (this._eventMap[cb] = wrappedCallback),
                        nativeAddEventListener.apply(this, [
                          nativeEventName,
                          wrappedCallback
                        ])
                      );
                    };
                    var nativeRemoveEventListener = proto.removeEventListener;
                    (proto.removeEventListener = function(nativeEventName, cb) {
                      if (
                        nativeEventName !== eventNameToWrap ||
                        !this._eventMap ||
                        !this._eventMap[cb]
                      )
                        return nativeRemoveEventListener.apply(this, arguments);
                      var unwrappedCb = this._eventMap[cb];
                      return (
                        delete this._eventMap[cb],
                        nativeRemoveEventListener.apply(this, [
                          nativeEventName,
                          unwrappedCb
                        ])
                      );
                    }),
                      Object.defineProperty(proto, 'on' + eventNameToWrap, {
                        get: function() {
                          return this['_on' + eventNameToWrap];
                        },
                        set: function(cb) {
                          this['_on' + eventNameToWrap] &&
                            (this.removeEventListener(
                              eventNameToWrap,
                              this['_on' + eventNameToWrap]
                            ),
                            delete this['_on' + eventNameToWrap]),
                            cb &&
                              this.addEventListener(
                                eventNameToWrap,
                                (this['_on' + eventNameToWrap] = cb)
                              );
                        }
                      });
                  }
                }
                var SDPUtils = requirecopy('sdp');
                module.exports = {
                  shimRTCIceCandidate: function(window) {
                    if (
                      !(
                        window.RTCIceCandidate &&
                        'foundation' in window.RTCIceCandidate.prototype
                      )
                    ) {
                      var NativeRTCIceCandidate = window.RTCIceCandidate;
                      (window.RTCIceCandidate = function(args) {
                        'object' == typeof args &&
                          args.candidate &&
                          0 === args.candidate.indexOf('a=') &&
                          ((args = JSON.parse(JSON.stringify(args))),
                          (args.candidate = args.candidate.substr(2)));
                        var nativeCandidate = new NativeRTCIceCandidate(args),
                          parsedCandidate = SDPUtils.parseCandidate(
                            args.candidate
                          ),
                          augmentedCandidate = Object.assign(
                            nativeCandidate,
                            parsedCandidate
                          );
                        return (
                          (augmentedCandidate.toJSON = function() {
                            return {
                              candidate: augmentedCandidate.candidate,
                              sdpMid: augmentedCandidate.sdpMid,
                              sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
                              usernameFragment:
                                augmentedCandidate.usernameFragment
                            };
                          }),
                          augmentedCandidate
                        );
                      }),
                        wrapPeerConnectionEvent(
                          window,
                          'icecandidate',
                          function(e) {
                            return (
                              e.candidate &&
                                Object.defineProperty(e, 'candidate', {
                                  value: new window.RTCIceCandidate(
                                    e.candidate
                                  ),
                                  writable: 'false'
                                }),
                              e
                            );
                          }
                        );
                    }
                  }
                };
              },
              { sdp: 2 }
            ],
            8: [
              function(requirecopy, module, exports) {
                'use strict';
                var utils = requirecopy('../utils'),
                  shimRTCPeerConnection = requirecopy('rtcpeerconnection-shim');
                module.exports = {
                  shimGetUserMedia: requirecopy('./getusermedia'),
                  shimPeerConnection: function(window) {
                    var browserDetails = utils.detectBrowser(window);
                    if (
                      window.RTCIceGatherer &&
                      (window.RTCIceCandidate ||
                        (window.RTCIceCandidate = function(args) {
                          return args;
                        }),
                      window.RTCSessionDescription ||
                        (window.RTCSessionDescription = function(args) {
                          return args;
                        }),
                      browserDetails.version < 15025)
                    ) {
                      var origMSTEnabled = Object.getOwnPropertyDescriptor(
                        window.MediaStreamTrack.prototype,
                        'enabled'
                      );
                      Object.defineProperty(
                        window.MediaStreamTrack.prototype,
                        'enabled',
                        {
                          set: function(value) {
                            origMSTEnabled.set.call(this, value);
                            var ev = new Event('enabled');
                            (ev.enabled = value), this.dispatchEvent(ev);
                          }
                        }
                      );
                    }
                    !window.RTCRtpSender ||
                      'dtmf' in window.RTCRtpSender.prototype ||
                      Object.defineProperty(
                        window.RTCRtpSender.prototype,
                        'dtmf',
                        {
                          get: function() {
                            return (
                              void 0 === this._dtmf &&
                                ('audio' === this.track.kind
                                  ? (this._dtmf = new window.RTCDtmfSender(
                                      this
                                    ))
                                  : 'video' === this.track.kind &&
                                    (this._dtmf = null)),
                              this._dtmf
                            );
                          }
                        }
                      ),
                      (window.RTCPeerConnection = shimRTCPeerConnection(
                        window,
                        browserDetails.version
                      ));
                  },
                  shimReplaceTrack: function(window) {
                    !window.RTCRtpSender ||
                      'replaceTrack' in window.RTCRtpSender.prototype ||
                      (window.RTCRtpSender.prototype.replaceTrack =
                        window.RTCRtpSender.prototype.setTrack);
                  }
                };
              },
              {
                '../utils': 13,
                './getusermedia': 9,
                'rtcpeerconnection-shim': 1
              }
            ],
            9: [
              function(requirecopy, module, exports) {
                'use strict';
                module.exports = function(window) {
                  var navigator = window && window.navigator,
                    shimError_ = function(e) {
                      return {
                        name:
                          { PermissionDeniedError: 'NotAllowedError' }[
                            e.name
                          ] || e.name,
                        message: e.message,
                        constraint: e.constraint,
                        toString: function() {
                          return this.name;
                        }
                      };
                    },
                    origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
                      navigator.mediaDevices
                    );
                  navigator.mediaDevices.getUserMedia = function(c) {
                    return origGetUserMedia(c).catch(function(e) {
                      return Promise.reject(shimError_(e));
                    });
                  };
                };
              },
              {}
            ],
            10: [
              function(requirecopy, module, exports) {
                'use strict';
                var utils = requirecopy('../utils'),
                  firefoxShim = {
                    shimOnTrack: function(window) {
                      'object' != typeof window ||
                        !window.RTCPeerConnection ||
                        'ontrack' in window.RTCPeerConnection.prototype ||
                        Object.defineProperty(
                          window.RTCPeerConnection.prototype,
                          'ontrack',
                          {
                            get: function() {
                              return this._ontrack;
                            },
                            set: function(f) {
                              this._ontrack &&
                                (this.removeEventListener(
                                  'track',
                                  this._ontrack
                                ),
                                this.removeEventListener(
                                  'addstream',
                                  this._ontrackpoly
                                )),
                                this.addEventListener(
                                  'track',
                                  (this._ontrack = f)
                                ),
                                this.addEventListener(
                                  'addstream',
                                  (this._ontrackpoly = function(e) {
                                    e.stream.getTracks().forEach(
                                      function(track) {
                                        var event = new Event('track');
                                        (event.track = track),
                                          (event.receiver = { track: track }),
                                          (event.transceiver = {
                                            receiver: event.receiver
                                          }),
                                          (event.streams = [e.stream]),
                                          this.dispatchEvent(event);
                                      }.bind(this)
                                    );
                                  }.bind(this))
                                );
                            }
                          }
                        ),
                        'object' == typeof window &&
                          window.RTCPeerConnection &&
                          'receiver' in window.RTCTrackEvent.prototype &&
                          !('transceiver' in window.RTCTrackEvent.prototype) &&
                          Object.defineProperty(
                            window.RTCTrackEvent.prototype,
                            'transceiver',
                            {
                              get: function() {
                                return { receiver: this.receiver };
                              }
                            }
                          );
                    },
                    shimSourceObject: function(window) {
                      'object' == typeof window &&
                        (!window.HTMLMediaElement ||
                          'srcObject' in window.HTMLMediaElement.prototype ||
                          Object.defineProperty(
                            window.HTMLMediaElement.prototype,
                            'srcObject',
                            {
                              get: function() {
                                return this.mozSrcObject;
                              },
                              set: function(stream) {
                                this.mozSrcObject = stream;
                              }
                            }
                          ));
                    },
                    shimPeerConnection: function(window) {
                      var browserDetails = utils.detectBrowser(window);
                      if (
                        'object' == typeof window &&
                        (window.RTCPeerConnection ||
                          window.mozRTCPeerConnection)
                      ) {
                        window.RTCPeerConnection ||
                          ((window.RTCPeerConnection = function(
                            pcConfig,
                            pcConstraints
                          ) {
                            if (
                              browserDetails.version < 38 &&
                              pcConfig &&
                              pcConfig.iceServers
                            ) {
                              for (
                                var newIceServers = [], i = 0;
                                i < pcConfig.iceServers.length;
                                i++
                              ) {
                                var server = pcConfig.iceServers[i];
                                if (server.hasOwnProperty('urls'))
                                  for (var j = 0; j < server.urls.length; j++) {
                                    var newServer = { url: server.urls[j] };
                                    0 === server.urls[j].indexOf('turn') &&
                                      ((newServer.username = server.username),
                                      (newServer.credential =
                                        server.credential)),
                                      newIceServers.push(newServer);
                                  }
                                else newIceServers.push(pcConfig.iceServers[i]);
                              }
                              pcConfig.iceServers = newIceServers;
                            }
                            return new window.mozRTCPeerConnection(
                              pcConfig,
                              pcConstraints
                            );
                          }),
                          (window.RTCPeerConnection.prototype =
                            window.mozRTCPeerConnection.prototype),
                          window.mozRTCPeerConnection.generateCertificate &&
                            Object.defineProperty(
                              window.RTCPeerConnection,
                              'generateCertificate',
                              {
                                get: function() {
                                  return window.mozRTCPeerConnection
                                    .generateCertificate;
                                }
                              }
                            ),
                          (window.RTCSessionDescription =
                            window.mozRTCSessionDescription),
                          (window.RTCIceCandidate = window.mozRTCIceCandidate)),
                          [
                            'setLocalDescription',
                            'setRemoteDescription',
                            'addIceCandidate'
                          ].forEach(function(method) {
                            var nativeMethod =
                              window.RTCPeerConnection.prototype[method];
                            window.RTCPeerConnection.prototype[
                              method
                            ] = function() {
                              return (
                                (arguments[0] = new ('addIceCandidate' ===
                                method
                                  ? window.RTCIceCandidate
                                  : window.RTCSessionDescription)(
                                  arguments[0]
                                )),
                                nativeMethod.apply(this, arguments)
                              );
                            };
                          });
                        var nativeAddIceCandidate =
                          window.RTCPeerConnection.prototype.addIceCandidate;
                        window.RTCPeerConnection.prototype.addIceCandidate = function() {
                          return arguments[0]
                            ? nativeAddIceCandidate.apply(this, arguments)
                            : (arguments[1] && arguments[1].apply(null),
                              Promise.resolve());
                        };
                        var makeMapStats = function(stats) {
                            var map = new Map();
                            return (
                              Object.keys(stats).forEach(function(key) {
                                map.set(key, stats[key]),
                                  (map[key] = stats[key]);
                              }),
                              map
                            );
                          },
                          modernStatsTypes = {
                            inboundrtp: 'inbound-rtp',
                            outboundrtp: 'outbound-rtp',
                            candidatepair: 'candidate-pair',
                            localcandidate: 'local-candidate',
                            remotecandidate: 'remote-candidate'
                          },
                          nativeGetStats =
                            window.RTCPeerConnection.prototype.getStats;
                        window.RTCPeerConnection.prototype.getStats = function(
                          selector,
                          onSucc,
                          onErr
                        ) {
                          return nativeGetStats
                            .apply(this, [selector || null])
                            .then(function(stats) {
                              if (
                                (browserDetails.version < 48 &&
                                  (stats = makeMapStats(stats)),
                                browserDetails.version < 53 && !onSucc)
                              )
                                try {
                                  stats.forEach(function(stat) {
                                    stat.type =
                                      modernStatsTypes[stat.type] || stat.type;
                                  });
                                } catch (e) {
                                  if ('TypeError' !== e.name) throw e;
                                  stats.forEach(function(stat, i) {
                                    stats.set(
                                      i,
                                      Object.assign({}, stat, {
                                        type:
                                          modernStatsTypes[stat.type] ||
                                          stat.type
                                      })
                                    );
                                  });
                                }
                              return stats;
                            })
                            .then(onSucc, onErr);
                        };
                      }
                    }
                  };
                module.exports = {
                  shimOnTrack: firefoxShim.shimOnTrack,
                  shimSourceObject: firefoxShim.shimSourceObject,
                  shimPeerConnection: firefoxShim.shimPeerConnection,
                  shimGetUserMedia: requirecopy('./getusermedia')
                };
              },
              { '../utils': 13, './getusermedia': 11 }
            ],
            11: [
              function(requirecopy, module, exports) {
                'use strict';
                var utils = requirecopy('../utils'),
                  logging = utils.log;
                module.exports = function(window) {
                  var browserDetails = utils.detectBrowser(window),
                    navigator = window && window.navigator,
                    MediaStreamTrack = window && window.MediaStreamTrack,
                    shimError_ = function(e) {
                      return {
                        name:
                          {
                            InternalError: 'NotReadableError',
                            NotSupportedError: 'TypeError',
                            PermissionDeniedError: 'NotAllowedError',
                            SecurityError: 'NotAllowedError'
                          }[e.name] || e.name,
                        message:
                          {
                            'The operation is insecure.':
                              'The request is not allowed by the user agent or the platform in the current context.'
                          }[e.message] || e.message,
                        constraint: e.constraint,
                        toString: function() {
                          return (
                            this.name + (this.message && ': ') + this.message
                          );
                        }
                      };
                    },
                    getUserMedia_ = function(constraints, onSuccess, onError) {
                      var constraintsToFF37_ = function(c) {
                        if ('object' != typeof c || c.require) return c;
                        var require = [];
                        return (
                          Object.keys(c).forEach(function(key) {
                            if (
                              'require' !== key &&
                              'advanced' !== key &&
                              'mediaSource' !== key
                            ) {
                              var r = (c[key] =
                                'object' == typeof c[key]
                                  ? c[key]
                                  : { ideal: c[key] });
                              if (
                                ((void 0 === r.min &&
                                  void 0 === r.max &&
                                  void 0 === r.exact) ||
                                  require.push(key),
                                void 0 !== r.exact &&
                                  ('number' == typeof r.exact
                                    ? (r.min = r.max = r.exact)
                                    : (c[key] = r.exact),
                                  delete r.exact),
                                void 0 !== r.ideal)
                              ) {
                                c.advanced = c.advanced || [];
                                var oc = {};
                                'number' == typeof r.ideal
                                  ? (oc[key] = { min: r.ideal, max: r.ideal })
                                  : (oc[key] = r.ideal),
                                  c.advanced.push(oc),
                                  delete r.ideal,
                                  Object.keys(r).length || delete c[key];
                              }
                            }
                          }),
                          require.length && (c.require = require),
                          c
                        );
                      };
                      return (
                        (constraints = JSON.parse(JSON.stringify(constraints))),
                        browserDetails.version < 38 &&
                          (logging('spec: ' + JSON.stringify(constraints)),
                          constraints.audio &&
                            (constraints.audio = constraintsToFF37_(
                              constraints.audio
                            )),
                          constraints.video &&
                            (constraints.video = constraintsToFF37_(
                              constraints.video
                            )),
                          logging('ff37: ' + JSON.stringify(constraints))),
                        navigator.mozGetUserMedia(
                          constraints,
                          onSuccess,
                          function(e) {
                            onError(shimError_(e));
                          }
                        )
                      );
                    },
                    getUserMediaPromise_ = function(constraints) {
                      return new Promise(function(resolve, reject) {
                        getUserMedia_(constraints, resolve, reject);
                      });
                    };
                  if (
                    (navigator.mediaDevices ||
                      (navigator.mediaDevices = {
                        getUserMedia: getUserMediaPromise_,
                        addEventListener: function() {},
                        removeEventListener: function() {}
                      }),
                    (navigator.mediaDevices.enumerateDevices =
                      navigator.mediaDevices.enumerateDevices ||
                      function() {
                        return new Promise(function(resolve) {
                          resolve([
                            {
                              kind: 'audioinput',
                              deviceId: 'default',
                              label: '',
                              groupId: ''
                            },
                            {
                              kind: 'videoinput',
                              deviceId: 'default',
                              label: '',
                              groupId: ''
                            }
                          ]);
                        });
                      }),
                    browserDetails.version < 41)
                  ) {
                    var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(
                      navigator.mediaDevices
                    );
                    navigator.mediaDevices.enumerateDevices = function() {
                      return orgEnumerateDevices().then(void 0, function(e) {
                        if ('NotFoundError' === e.name) return [];
                        throw e;
                      });
                    };
                  }
                  if (browserDetails.version < 49) {
                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
                      navigator.mediaDevices
                    );
                    navigator.mediaDevices.getUserMedia = function(c) {
                      return origGetUserMedia(c).then(
                        function(stream) {
                          if (
                            (c.audio && !stream.getAudioTracks().length) ||
                            (c.video && !stream.getVideoTracks().length)
                          )
                            throw (stream.getTracks().forEach(function(track) {
                              track.stop();
                            }),
                            new DOMException(
                              'The object can not be found here.',
                              'NotFoundError'
                            ));
                          return stream;
                        },
                        function(e) {
                          return Promise.reject(shimError_(e));
                        }
                      );
                    };
                  }
                  if (
                    !(
                      browserDetails.version > 55 &&
                      'autoGainControl' in
                        navigator.mediaDevices.getSupportedConstraints()
                    )
                  ) {
                    var remap = function(obj, a, b) {
                        a in obj &&
                          !(b in obj) &&
                          ((obj[b] = obj[a]), delete obj[a]);
                      },
                      nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
                        navigator.mediaDevices
                      );
                    if (
                      ((navigator.mediaDevices.getUserMedia = function(c) {
                        return (
                          'object' == typeof c &&
                            'object' == typeof c.audio &&
                            ((c = JSON.parse(JSON.stringify(c))),
                            remap(
                              c.audio,
                              'autoGainControl',
                              'mozAutoGainControl'
                            ),
                            remap(
                              c.audio,
                              'noiseSuppression',
                              'mozNoiseSuppression'
                            )),
                          nativeGetUserMedia(c)
                        );
                      }),
                      MediaStreamTrack &&
                        MediaStreamTrack.prototype.getSettings)
                    ) {
                      var nativeGetSettings =
                        MediaStreamTrack.prototype.getSettings;
                      MediaStreamTrack.prototype.getSettings = function() {
                        var obj = nativeGetSettings.apply(this, arguments);
                        return (
                          remap(obj, 'mozAutoGainControl', 'autoGainControl'),
                          remap(obj, 'mozNoiseSuppression', 'noiseSuppression'),
                          obj
                        );
                      };
                    }
                    if (
                      MediaStreamTrack &&
                      MediaStreamTrack.prototype.applyConstraints
                    ) {
                      var nativeApplyConstraints =
                        MediaStreamTrack.prototype.applyConstraints;
                      MediaStreamTrack.prototype.applyConstraints = function(
                        c
                      ) {
                        return (
                          'audio' === this.kind &&
                            'object' == typeof c &&
                            ((c = JSON.parse(JSON.stringify(c))),
                            remap(c, 'autoGainControl', 'mozAutoGainControl'),
                            remap(
                              c,
                              'noiseSuppression',
                              'mozNoiseSuppression'
                            )),
                          nativeApplyConstraints.apply(this, [c])
                        );
                      };
                    }
                  }
                  navigator.getUserMedia = function(
                    constraints,
                    onSuccess,
                    onError
                  ) {
                    if (browserDetails.version < 44)
                      return getUserMedia_(constraints, onSuccess, onError);
                    utils.deprecated(
                      'navigator.getUserMedia',
                      'navigator.mediaDevices.getUserMedia'
                    ),
                      navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(onSuccess, onError);
                  };
                };
              },
              { '../utils': 13 }
            ],
            12: [
              function(requirecopy, module, exports) {
                'use strict';
                var utils = requirecopy('../utils'),
                  safariShim = {
                    shimLocalStreamsAPI: function(window) {
                      if (
                        'object' == typeof window &&
                        window.RTCPeerConnection
                      ) {
                        if (
                          ('getLocalStreams' in
                            window.RTCPeerConnection.prototype ||
                            (window.RTCPeerConnection.prototype.getLocalStreams = function() {
                              return (
                                this._localStreams || (this._localStreams = []),
                                this._localStreams
                              );
                            }),
                          'getStreamById' in
                            window.RTCPeerConnection.prototype ||
                            (window.RTCPeerConnection.prototype.getStreamById = function(
                              id
                            ) {
                              var result = null;
                              return (
                                this._localStreams &&
                                  this._localStreams.forEach(function(stream) {
                                    stream.id === id && (result = stream);
                                  }),
                                this._remoteStreams &&
                                  this._remoteStreams.forEach(function(stream) {
                                    stream.id === id && (result = stream);
                                  }),
                                result
                              );
                            }),
                          !('addStream' in window.RTCPeerConnection.prototype))
                        ) {
                          var _addTrack =
                            window.RTCPeerConnection.prototype.addTrack;
                          (window.RTCPeerConnection.prototype.addStream = function(
                            stream
                          ) {
                            this._localStreams || (this._localStreams = []),
                              -1 === this._localStreams.indexOf(stream) &&
                                this._localStreams.push(stream);
                            var self = this;
                            stream.getTracks().forEach(function(track) {
                              _addTrack.call(self, track, stream);
                            });
                          }),
                            (window.RTCPeerConnection.prototype.addTrack = function(
                              track,
                              stream
                            ) {
                              stream &&
                                (this._localStreams
                                  ? -1 === this._localStreams.indexOf(stream) &&
                                    this._localStreams.push(stream)
                                  : (this._localStreams = [stream])),
                                _addTrack.call(this, track, stream);
                            });
                        }
                        'removeStream' in window.RTCPeerConnection.prototype ||
                          (window.RTCPeerConnection.prototype.removeStream = function(
                            stream
                          ) {
                            this._localStreams || (this._localStreams = []);
                            var index = this._localStreams.indexOf(stream);
                            if (-1 !== index) {
                              this._localStreams.splice(index, 1);
                              var self = this,
                                tracks = stream.getTracks();
                              this.getSenders().forEach(function(sender) {
                                -1 !== tracks.indexOf(sender.track) &&
                                  self.removeTrack(sender);
                              });
                            }
                          });
                      }
                    },
                    shimRemoteStreamsAPI: function(window) {
                      'object' == typeof window &&
                        window.RTCPeerConnection &&
                        ('getRemoteStreams' in
                          window.RTCPeerConnection.prototype ||
                          (window.RTCPeerConnection.prototype.getRemoteStreams = function() {
                            return this._remoteStreams
                              ? this._remoteStreams
                              : [];
                          }),
                        'onaddstream' in window.RTCPeerConnection.prototype ||
                          Object.defineProperty(
                            window.RTCPeerConnection.prototype,
                            'onaddstream',
                            {
                              get: function() {
                                return this._onaddstream;
                              },
                              set: function(f) {
                                this._onaddstream &&
                                  (this.removeEventListener(
                                    'addstream',
                                    this._onaddstream
                                  ),
                                  this.removeEventListener(
                                    'track',
                                    this._onaddstreampoly
                                  )),
                                  this.addEventListener(
                                    'addstream',
                                    (this._onaddstream = f)
                                  ),
                                  this.addEventListener(
                                    'track',
                                    (this._onaddstreampoly = function(e) {
                                      var stream = e.streams[0];
                                      if (
                                        (this._remoteStreams ||
                                          (this._remoteStreams = []),
                                        !(
                                          this._remoteStreams.indexOf(stream) >=
                                          0
                                        ))
                                      ) {
                                        this._remoteStreams.push(stream);
                                        var event = new Event('addstream');
                                        (event.stream = e.streams[0]),
                                          this.dispatchEvent(event);
                                      }
                                    }.bind(this))
                                  );
                              }
                            }
                          ));
                    },
                    shimCallbacksAPI: function(window) {
                      if (
                        'object' == typeof window &&
                        window.RTCPeerConnection
                      ) {
                        var prototype = window.RTCPeerConnection.prototype,
                          createOffer = prototype.createOffer,
                          createAnswer = prototype.createAnswer,
                          setLocalDescription = prototype.setLocalDescription,
                          setRemoteDescription = prototype.setRemoteDescription,
                          addIceCandidate = prototype.addIceCandidate;
                        (prototype.createOffer = function(
                          successCallback,
                          failureCallback
                        ) {
                          var options =
                              arguments.length >= 2
                                ? arguments[2]
                                : arguments[0],
                            promise = createOffer.apply(this, [options]);
                          return failureCallback
                            ? (promise.then(successCallback, failureCallback),
                              Promise.resolve())
                            : promise;
                        }),
                          (prototype.createAnswer = function(
                            successCallback,
                            failureCallback
                          ) {
                            var options =
                                arguments.length >= 2
                                  ? arguments[2]
                                  : arguments[0],
                              promise = createAnswer.apply(this, [options]);
                            return failureCallback
                              ? (promise.then(successCallback, failureCallback),
                                Promise.resolve())
                              : promise;
                          });
                        var withCallback = function(
                          description,
                          successCallback,
                          failureCallback
                        ) {
                          var promise = setLocalDescription.apply(this, [
                            description
                          ]);
                          return failureCallback
                            ? (promise.then(successCallback, failureCallback),
                              Promise.resolve())
                            : promise;
                        };
                        (prototype.setLocalDescription = withCallback),
                          (withCallback = function(
                            description,
                            successCallback,
                            failureCallback
                          ) {
                            var promise = setRemoteDescription.apply(this, [
                              description
                            ]);
                            return failureCallback
                              ? (promise.then(successCallback, failureCallback),
                                Promise.resolve())
                              : promise;
                          }),
                          (prototype.setRemoteDescription = withCallback),
                          (withCallback = function(
                            candidate,
                            successCallback,
                            failureCallback
                          ) {
                            var promise = addIceCandidate.apply(this, [
                              candidate
                            ]);
                            return failureCallback
                              ? (promise.then(successCallback, failureCallback),
                                Promise.resolve())
                              : promise;
                          }),
                          (prototype.addIceCandidate = withCallback);
                      }
                    },
                    shimGetUserMedia: function(window) {
                      var navigator = window && window.navigator;
                      navigator.getUserMedia ||
                        (navigator.webkitGetUserMedia
                          ? (navigator.getUserMedia = navigator.webkitGetUserMedia.bind(
                              navigator
                            ))
                          : navigator.mediaDevices &&
                            navigator.mediaDevices.getUserMedia &&
                            (navigator.getUserMedia = function(
                              constraints,
                              cb,
                              errcb
                            ) {
                              navigator.mediaDevices
                                .getUserMedia(constraints)
                                .then(cb, errcb);
                            }.bind(navigator)));
                    },
                    shimRTCIceServerUrls: function(window) {
                      var OrigPeerConnection = window.RTCPeerConnection;
                      (window.RTCPeerConnection = function(
                        pcConfig,
                        pcConstraints
                      ) {
                        if (pcConfig && pcConfig.iceServers) {
                          for (
                            var newIceServers = [], i = 0;
                            i < pcConfig.iceServers.length;
                            i++
                          ) {
                            var server = pcConfig.iceServers[i];
                            !server.hasOwnProperty('urls') &&
                            server.hasOwnProperty('url')
                              ? (utils.deprecated(
                                  'RTCIceServer.url',
                                  'RTCIceServer.urls'
                                ),
                                (server = JSON.parse(JSON.stringify(server))),
                                (server.urls = server.url),
                                delete server.url,
                                newIceServers.push(server))
                              : newIceServers.push(pcConfig.iceServers[i]);
                          }
                          pcConfig.iceServers = newIceServers;
                        }
                        return new OrigPeerConnection(pcConfig, pcConstraints);
                      }),
                        (window.RTCPeerConnection.prototype =
                          OrigPeerConnection.prototype),
                        Object.defineProperty(
                          window.RTCPeerConnection,
                          'generateCertificate',
                          {
                            get: function() {
                              return OrigPeerConnection.generateCertificate;
                            }
                          }
                        );
                    },
                    shimTrackEventTransceiver: function(window) {
                      'object' == typeof window &&
                        window.RTCPeerConnection &&
                        'receiver' in window.RTCTrackEvent.prototype &&
                        !window.RTCTransceiver &&
                        Object.defineProperty(
                          window.RTCTrackEvent.prototype,
                          'transceiver',
                          {
                            get: function() {
                              return { receiver: this.receiver };
                            }
                          }
                        );
                    }
                  };
                module.exports = {
                  shimCallbacksAPI: safariShim.shimCallbacksAPI,
                  shimLocalStreamsAPI: safariShim.shimLocalStreamsAPI,
                  shimRemoteStreamsAPI: safariShim.shimRemoteStreamsAPI,
                  shimGetUserMedia: safariShim.shimGetUserMedia,
                  shimRTCIceServerUrls: safariShim.shimRTCIceServerUrls,
                  shimTrackEventTransceiver:
                    safariShim.shimTrackEventTransceiver
                };
              },
              { '../utils': 13 }
            ],
            13: [
              function(requirecopy, module, exports) {
                'use strict';
                var logDisabled_ = !0,
                  deprecationWarnings_ = !0,
                  utils = {
                    disableLog: function(bool) {
                      return 'boolean' != typeof bool
                        ? new Error(
                            'Argument type: ' +
                              typeof bool +
                              '. Please use a boolean.'
                          )
                        : ((logDisabled_ = bool),
                          bool
                            ? 'adapter.js logging disabled'
                            : 'adapter.js logging enabled');
                    },
                    disableWarnings: function(bool) {
                      return 'boolean' != typeof bool
                        ? new Error(
                            'Argument type: ' +
                              typeof bool +
                              '. Please use a boolean.'
                          )
                        : ((deprecationWarnings_ = !bool),
                          'adapter.js deprecation warnings ' +
                            (bool ? 'disabled' : 'enabled'));
                    },
                    log: function() {
                      if ('object' == typeof window) {
                        if (logDisabled_) return;
                        'undefined' != typeof console && console.log;
                      }
                    },
                    deprecated: function(oldMethod, newMethod) {},
                    extractVersion: function(uastring, expr, pos) {
                      var match = uastring.match(expr);
                      return (
                        match && match.length >= pos && parseInt(match[pos], 10)
                      );
                    },
                    detectBrowser: function(window) {
                      var navigator = window && window.navigator,
                        result = {};
                      if (
                        ((result.browser = null),
                        (result.version = null),
                        void 0 === window || !window.navigator)
                      )
                        return (result.browser = 'Not a browser.'), result;
                      if (navigator.mozGetUserMedia)
                        (result.browser = 'firefox'),
                          (result.version = this.extractVersion(
                            navigator.userAgent,
                            /Firefox\/(\d+)\./,
                            1
                          ));
                      else if (navigator.webkitGetUserMedia)
                        if (window.webkitRTCPeerConnection)
                          (result.browser = 'chrome'),
                            (result.version = this.extractVersion(
                              navigator.userAgent,
                              /Chrom(e|ium)\/(\d+)\./,
                              2
                            ));
                        else {
                          if (
                            !navigator.userAgent.match(/Version\/(\d+).(\d+)/)
                          )
                            return (
                              (result.browser =
                                'Unsupported webkit-based browser with GUM support but no WebRTC support.'),
                              result
                            );
                          (result.browser = 'safari'),
                            (result.version = this.extractVersion(
                              navigator.userAgent,
                              /AppleWebKit\/(\d+)\./,
                              1
                            ));
                        }
                      else if (
                        navigator.mediaDevices &&
                        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)
                      )
                        (result.browser = 'edge'),
                          (result.version = this.extractVersion(
                            navigator.userAgent,
                            /Edge\/(\d+).(\d+)$/,
                            2
                          ));
                      else {
                        if (
                          !navigator.mediaDevices ||
                          !navigator.userAgent.match(/AppleWebKit\/(\d+)\./)
                        )
                          return (
                            (result.browser = 'Not a supported browser.'),
                            result
                          );
                        (result.browser = 'safari'),
                          (result.version = this.extractVersion(
                            navigator.userAgent,
                            /AppleWebKit\/(\d+)\./,
                            1
                          ));
                      }
                      return result;
                    },
                    shimCreateObjectURL: function(window) {
                      var URL = window && window.URL;
                      if (
                        'object' == typeof window &&
                        window.HTMLMediaElement &&
                        'srcObject' in window.HTMLMediaElement.prototype &&
                        URL.createObjectURL &&
                        URL.revokeObjectURL
                      ) {
                        var nativeCreateObjectURL = URL.createObjectURL.bind(
                            URL
                          ),
                          nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL),
                          streams = new Map(),
                          newId = 0;
                        (URL.createObjectURL = function(stream) {
                          if ('getTracks' in stream) {
                            var url = 'polyblob:' + ++newId;
                            return (
                              streams.set(url, stream),
                              utils.deprecated(
                                'URL.createObjectURL(stream)',
                                'elem.srcObject = stream'
                              ),
                              url
                            );
                          }
                          return nativeCreateObjectURL(stream);
                        }),
                          (URL.revokeObjectURL = function(url) {
                            nativeRevokeObjectURL(url), streams.delete(url);
                          });
                        var dsc = Object.getOwnPropertyDescriptor(
                          window.HTMLMediaElement.prototype,
                          'src'
                        );
                        Object.defineProperty(
                          window.HTMLMediaElement.prototype,
                          'src',
                          {
                            get: function() {
                              return dsc.get.apply(this);
                            },
                            set: function(url) {
                              return (
                                (this.srcObject = streams.get(url) || null),
                                dsc.set.apply(this, [url])
                              );
                            }
                          }
                        );
                        var nativeSetAttribute =
                          window.HTMLMediaElement.prototype.setAttribute;
                        window.HTMLMediaElement.prototype.setAttribute = function() {
                          return (
                            2 === arguments.length &&
                              'src' === ('' + arguments[0]).toLowerCase() &&
                              (this.srcObject =
                                streams.get(arguments[1]) || null),
                            nativeSetAttribute.apply(this, arguments)
                          );
                        };
                      }
                    }
                  };
                module.exports = {
                  log: utils.log,
                  deprecated: utils.deprecated,
                  disableLog: utils.disableLog,
                  disableWarnings: utils.disableWarnings,
                  extractVersion: utils.extractVersion,
                  shimCreateObjectURL: utils.shimCreateObjectURL,
                  detectBrowser: utils.detectBrowser.bind(utils)
                };
              },
              {}
            ]
          },
          {},
          [3]
        )(3);
      }),
      navigator.mozGetUserMedia
        ? ((MediaStreamTrack.getSources = function(successCb) {
            setTimeout(function() {
              successCb([
                { kind: 'audio', id: 'default', label: '', facing: '' },
                { kind: 'video', id: 'default', label: '', facing: '' }
              ]);
            }, 0);
          }),
          (attachMediaStream = function(element, stream) {
            return (element.srcObject = stream), element;
          }),
          (reattachMediaStream = function(to, from) {
            return (to.srcObject = from.srcObject), to;
          }),
          (createIceServer = function(url, username, password) {
            var iceServer = null,
              urlParts = url.split(':');
            if (0 === urlParts[0].indexOf('stun')) iceServer = { urls: [url] };
            else if (0 === urlParts[0].indexOf('turn'))
              if (AdapterJS.webrtcDetectedVersion < 27) {
                var turnUrlParts = url.split('?');
                (1 !== turnUrlParts.length &&
                  0 !== turnUrlParts[1].indexOf('transport=udp')) ||
                  (iceServer = {
                    urls: [turnUrlParts[0]],
                    credential: password,
                    username: username
                  });
              } else
                iceServer = {
                  urls: [url],
                  credential: password,
                  username: username
                };
            return iceServer;
          }),
          (createIceServers = function(urls, username, password) {
            var iceServers = [];
            for (i = 0; i < urls.length; i++) {
              var iceServer = createIceServer(urls[i], username, password);
              null !== iceServer && iceServers.push(iceServer);
            }
            return iceServers;
          }))
        : navigator.webkitGetUserMedia
          ? ((attachMediaStream = function(element, stream) {
              return (
                AdapterJS.webrtcDetectedVersion >= 43
                  ? (element.srcObject = stream)
                  : void 0 !== element.src &&
                    (element.src = URL.createObjectURL(stream)),
                element
              );
            }),
            (reattachMediaStream = function(to, from) {
              return (
                AdapterJS.webrtcDetectedVersion >= 43
                  ? (to.srcObject = from.srcObject)
                  : (to.src = from.src),
                to
              );
            }),
            (createIceServer = function(url, username, password) {
              var iceServer = null,
                urlParts = url.split(':');
              return (
                0 === urlParts[0].indexOf('stun')
                  ? (iceServer = { url: url })
                  : 0 === urlParts[0].indexOf('turn') &&
                    (iceServer = {
                      url: url,
                      credential: password,
                      username: username
                    }),
                iceServer
              );
            }),
            (createIceServers = function(urls, username, password) {
              var iceServers = [];
              if (AdapterJS.webrtcDetectedVersion >= 34)
                iceServers = {
                  urls: urls,
                  credential: password,
                  username: username
                };
              else
                for (i = 0; i < urls.length; i++) {
                  var iceServer = createIceServer(urls[i], username, password);
                  null !== iceServer && iceServers.push(iceServer);
                }
              return iceServers;
            }))
          : 'AppleWebKit' === AdapterJS.webrtcDetectedType
            ? ((attachMediaStream = function(element, stream) {
                return (element.srcObject = stream), element;
              }),
              (reattachMediaStream = function(to, from) {
                return (to.srcObject = from.srcObject), to;
              }),
              navigator.mediaDevices &&
                navigator.mediaDevices.getUserMedia &&
                (navigator.getUserMedia = getUserMedia = function(
                  constraints,
                  successCb,
                  errorCb
                ) {
                  navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then(successCb)
                    .catch(errorCb);
                }))
            : navigator.mediaDevices &&
              navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) &&
              ((attachMediaStream = function(element, stream) {
                return (element.srcObject = stream), element;
              }),
              (reattachMediaStream = function(to, from) {
                return (to.srcObject = from.srcObject), to;
              })),
      (attachMediaStream_base = attachMediaStream),
      'opera' === AdapterJS.webrtcDetectedBrowser &&
        (attachMediaStream_base = function(element, stream) {
          AdapterJS.webrtcDetectedVersion > 38
            ? (element.srcObject = stream)
            : void 0 !== element.src &&
              (element.src = URL.createObjectURL(stream));
        }),
      (attachMediaStream = function(element, stream) {
        return (
          ('chrome' !== AdapterJS.webrtcDetectedBrowser &&
            'opera' !== AdapterJS.webrtcDetectedBrowser) ||
          stream
            ? attachMediaStream_base(element, stream)
            : (element.src = ''),
          element
        );
      }),
      (reattachMediaStream_base = reattachMediaStream),
      (reattachMediaStream = function(to, from) {
        return reattachMediaStream_base(to, from), to;
      }),
      (window.attachMediaStream = attachMediaStream),
      (window.reattachMediaStream = reattachMediaStream),
      (window.getUserMedia = function(constraints, onSuccess, onFailure) {
        navigator.getUserMedia(constraints, onSuccess, onFailure);
      }),
      (AdapterJS.attachMediaStream = attachMediaStream),
      (AdapterJS.reattachMediaStream = reattachMediaStream),
      (AdapterJS.getUserMedia = getUserMedia),
      'undefined' == typeof Promise && (requestUserMedia = null),
      AdapterJS.maybeThroughWebRTCReady())
    : (('object' == typeof console && 'function' == typeof console.log) ||
        ((console = {} || console),
        (console.log = function(arg) {}),
        (console.info = function(arg) {}),
        (console.error = function(arg) {}),
        (console.dir = function(arg) {}),
        (console.exception = function(arg) {}),
        (console.trace = function(arg) {}),
        (console.warn = function(arg) {}),
        (console.count = function(arg) {}),
        (console.debug = function(arg) {}),
        (console.count = function(arg) {}),
        (console.time = function(arg) {}),
        (console.timeEnd = function(arg) {}),
        (console.group = function(arg) {}),
        (console.groupCollapsed = function(arg) {}),
        (console.groupEnd = function(arg) {})),
      (AdapterJS.WebRTCPlugin.WaitForPluginReady = function() {
        for (
          ;
          AdapterJS.WebRTCPlugin.pluginState !==
          AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;

        );
      }),
      (AdapterJS.WebRTCPlugin.callWhenPluginReady = function(callback) {
        if (
          AdapterJS.WebRTCPlugin.pluginState ===
          AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY
        )
          callback();
        else
          var checkPluginReadyState = setInterval(function() {
            AdapterJS.WebRTCPlugin.pluginState ===
              AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY &&
              (clearInterval(checkPluginReadyState), callback());
          }, 100);
      }),
      (AdapterJS.WebRTCPlugin.setLogLevel = function(logLevel) {
        AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
          AdapterJS.WebRTCPlugin.plugin.setLogLevel(logLevel);
        });
      }),
      (AdapterJS.WebRTCPlugin.injectPlugin = function() {
        if (
          ('interactive' === document.readyState ||
            'complete' === document.readyState) &&
          AdapterJS.WebRTCPlugin.pluginState ===
            AdapterJS.WebRTCPlugin.PLUGIN_STATES.INITIALIZING
        ) {
          if (
            ((AdapterJS.WebRTCPlugin.pluginState =
              AdapterJS.WebRTCPlugin.PLUGIN_STATES.INJECTING),
            'IE' === AdapterJS.webrtcDetectedBrowser &&
              AdapterJS.webrtcDetectedVersion <= 10)
          ) {
            var frag = document.createDocumentFragment();
            for (
              AdapterJS.WebRTCPlugin.plugin = document.createElement('div'),
                AdapterJS.WebRTCPlugin.plugin.innerHTML =
                  '<object id="' +
                  AdapterJS.WebRTCPlugin.pluginInfo.pluginId +
                  '" type="' +
                  AdapterJS.WebRTCPlugin.pluginInfo.type +
                  '" width="1" height="1"><param name="pluginId" value="' +
                  AdapterJS.WebRTCPlugin.pluginInfo.pluginId +
                  '" /> <param name="windowless" value="false" /> <param name="pageId" value="' +
                  AdapterJS.WebRTCPlugin.pageId +
                  '" /> <param name="onload" value="' +
                  AdapterJS.WebRTCPlugin.pluginInfo.onload +
                  '" /><param name="tag" value="' +
                  AdapterJS.WebRTCPlugin.TAGS.NONE +
                  '" />' +
                  (AdapterJS.options.getAllCams
                    ? '<param name="forceGetAllCams" value="True" />'
                    : '') +
                  '</object>';
              AdapterJS.WebRTCPlugin.plugin.firstChild;

            )
              frag.appendChild(AdapterJS.WebRTCPlugin.plugin.firstChild);
            document.body.appendChild(frag),
              (AdapterJS.WebRTCPlugin.plugin = document.getElementById(
                AdapterJS.WebRTCPlugin.pluginInfo.pluginId
              ));
          } else
            (AdapterJS.WebRTCPlugin.plugin = document.createElement('object')),
              (AdapterJS.WebRTCPlugin.plugin.id =
                AdapterJS.WebRTCPlugin.pluginInfo.pluginId),
              'IE' === AdapterJS.webrtcDetectedBrowser
                ? ((AdapterJS.WebRTCPlugin.plugin.width = '1px'),
                  (AdapterJS.WebRTCPlugin.plugin.height = '1px'))
                : ((AdapterJS.WebRTCPlugin.plugin.width = '0px'),
                  (AdapterJS.WebRTCPlugin.plugin.height = '0px')),
              (AdapterJS.WebRTCPlugin.plugin.type =
                AdapterJS.WebRTCPlugin.pluginInfo.type),
              (AdapterJS.WebRTCPlugin.plugin.innerHTML =
                '<param name="onload" value="' +
                AdapterJS.WebRTCPlugin.pluginInfo.onload +
                '"><param name="pluginId" value="' +
                AdapterJS.WebRTCPlugin.pluginInfo.pluginId +
                '"><param name="windowless" value="false" /> ' +
                (AdapterJS.options.getAllCams
                  ? '<param name="forceGetAllCams" value="True" />'
                  : '') +
                '<param name="pageId" value="' +
                AdapterJS.WebRTCPlugin.pageId +
                '"><param name="tag" value="' +
                AdapterJS.WebRTCPlugin.TAGS.NONE +
                '" />'),
              document.body.appendChild(AdapterJS.WebRTCPlugin.plugin);
          AdapterJS.WebRTCPlugin.pluginState =
            AdapterJS.WebRTCPlugin.PLUGIN_STATES.INJECTED;
        }
      }),
      (AdapterJS.WebRTCPlugin.isPluginInstalled = function(
        comName,
        plugName,
        plugType,
        installedCb,
        notInstalledCb
      ) {
        if ('IE' !== AdapterJS.webrtcDetectedBrowser) {
          for (
            var pluginArray = navigator.mimeTypes, i = 0;
            i < pluginArray.length;
            i++
          )
            if (pluginArray[i].type.indexOf(plugType) >= 0)
              return void installedCb();
          notInstalledCb();
        } else {
          try {
            new ActiveXObject(comName + '.' + plugName);
          } catch (e) {
            return void notInstalledCb();
          }
          installedCb();
        }
      }),
      (AdapterJS.WebRTCPlugin.defineWebRTCInterface = function() {
        if (
          AdapterJS.WebRTCPlugin.pluginState !==
          AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY
        ) {
          (AdapterJS.WebRTCPlugin.pluginState =
            AdapterJS.WebRTCPlugin.PLUGIN_STATES.INITIALIZING),
            (AdapterJS.isDefined = function(variable) {
              return null !== variable && void 0 !== variable;
            }),
            (createIceServer = function(url, username, password) {
              var iceServer = null,
                urlParts = url.split(':');
              return (
                0 === urlParts[0].indexOf('stun')
                  ? (iceServer = { url: url, hasCredentials: !1 })
                  : 0 === urlParts[0].indexOf('turn') &&
                    (iceServer = {
                      url: url,
                      hasCredentials: !0,
                      credential: password,
                      username: username
                    }),
                iceServer
              );
            }),
            (createIceServers = function(urls, username, password) {
              for (var iceServers = [], i = 0; i < urls.length; ++i)
                iceServers.push(createIceServer(urls[i], username, password));
              return iceServers;
            }),
            (RTCSessionDescription = function(info) {
              return (
                AdapterJS.WebRTCPlugin.WaitForPluginReady(),
                AdapterJS.WebRTCPlugin.plugin.ConstructSessionDescription(
                  info.type,
                  info.sdp
                )
              );
            }),
            (MediaStream = function(mediaStreamOrTracks) {
              return (
                AdapterJS.WebRTCPlugin.WaitForPluginReady(),
                AdapterJS.WebRTCPlugin.plugin.MediaStream(mediaStreamOrTracks)
              );
            }),
            (RTCPeerConnection = function(servers, constraints) {
              if (
                void 0 !== servers &&
                null !== servers &&
                !Array.isArray(servers.iceServers)
              )
                throw new Error(
                  "Failed to construct 'RTCPeerConnection': Malformed RTCConfiguration"
                );
              if (void 0 !== constraints && null !== constraints) {
                var invalidConstraits = !1;
                if (
                  ((invalidConstraits |= 'object' != typeof constraints),
                  (invalidConstraits |=
                    constraints.hasOwnProperty('mandatory') &&
                    void 0 !== constraints.mandatory &&
                    null !== constraints.mandatory &&
                    constraints.mandatory.constructor !== Object),
                  (invalidConstraits |=
                    constraints.hasOwnProperty('optional') &&
                    void 0 !== constraints.optional &&
                    null !== constraints.optional &&
                    !Array.isArray(constraints.optional)))
                )
                  throw new Error(
                    "Failed to construct 'RTCPeerConnection': Malformed constraints object"
                  );
              }
              AdapterJS.WebRTCPlugin.WaitForPluginReady();
              var iceServers = null;
              if (servers && Array.isArray(servers.iceServers)) {
                iceServers = servers.iceServers;
                for (var i = 0; i < iceServers.length; i++)
                  iceServers[i].urls &&
                    !iceServers[i].url &&
                    (iceServers[i].url = iceServers[i].urls),
                    (iceServers[i].hasCredentials =
                      AdapterJS.isDefined(iceServers[i].username) &&
                      AdapterJS.isDefined(iceServers[i].credential));
              }
              if (
                AdapterJS.WebRTCPlugin.plugin.PEER_CONNECTION_VERSION &&
                AdapterJS.WebRTCPlugin.plugin.PEER_CONNECTION_VERSION > 1
              )
                return (
                  iceServers && (servers.iceServers = iceServers),
                  AdapterJS.WebRTCPlugin.plugin.PeerConnection(servers)
                );
              var mandatory =
                  constraints && constraints.mandatory
                    ? constraints.mandatory
                    : null,
                optional =
                  constraints && constraints.optional
                    ? constraints.optional
                    : null;
              return AdapterJS.WebRTCPlugin.plugin.PeerConnection(
                AdapterJS.WebRTCPlugin.pageId,
                iceServers,
                mandatory,
                optional
              );
            }),
            (MediaStreamTrack = function() {}),
            (MediaStreamTrack.getSources = function(callback) {
              AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
                AdapterJS.WebRTCPlugin.plugin.GetSources(callback);
              });
            });
          var constraintsToPlugin = function(c) {
            if ('object' != typeof c || c.mandatory || c.optional) return c;
            var cc = {};
            return (
              Object.keys(c).forEach(function(key) {
                if ('require' !== key && 'advanced' !== key) {
                  if ('string' == typeof c[key]) return void (cc[key] = c[key]);
                  var r =
                    'object' == typeof c[key] ? c[key] : { ideal: c[key] };
                  void 0 !== r.exact &&
                    'number' == typeof r.exact &&
                    (r.min = r.max = r.exact);
                  var oldname = function(prefix, name) {
                    return prefix
                      ? prefix + name.charAt(0).toUpperCase() + name.slice(1)
                      : 'deviceId' === name
                        ? 'sourceId'
                        : name;
                  };
                  if (
                    ('sourceId' === oldname('', key) &&
                      void 0 !== r.exact &&
                      ((r.ideal = r.exact), (r.exact = void 0)),
                    void 0 !== r.ideal)
                  ) {
                    cc.optional = cc.optional || [];
                    var oc = {};
                    'number' == typeof r.ideal
                      ? ((oc[oldname('min', key)] = r.ideal),
                        cc.optional.push(oc),
                        (oc = {}),
                        (oc[oldname('max', key)] = r.ideal),
                        cc.optional.push(oc))
                      : ((oc[oldname('', key)] = r.ideal),
                        cc.optional.push(oc));
                  }
                  void 0 !== r.exact && 'number' != typeof r.exact
                    ? ((cc.mandatory = cc.mandatory || {}),
                      (cc.mandatory[oldname('', key)] = r.exact))
                    : ['min', 'max'].forEach(function(mix) {
                        void 0 !== r[mix] &&
                          ((cc.mandatory = cc.mandatory || {}),
                          (cc.mandatory[oldname(mix, key)] = r[mix]));
                      });
                }
              }),
              c.advanced &&
                (cc.optional = (cc.optional || []).concat(c.advanced)),
              cc
            );
          };
          (getUserMedia = function(
            constraints,
            successCallback,
            failureCallback
          ) {
            var cc = {};
            (cc.audio =
              !!constraints.audio && constraintsToPlugin(constraints.audio)),
              (cc.video =
                !!constraints.video && constraintsToPlugin(constraints.video)),
              AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
                AdapterJS.WebRTCPlugin.plugin.getUserMedia(
                  cc,
                  successCallback,
                  failureCallback
                );
              });
          }),
            (window.navigator.getUserMedia = getUserMedia),
            'undefined' != typeof Promise &&
              ((requestUserMedia = function(constraints) {
                return new Promise(function(resolve, reject) {
                  try {
                    getUserMedia(constraints, resolve, reject);
                  } catch (error) {
                    reject(error);
                  }
                });
              }),
              (navigator.mediaDevices = {
                getUserMedia: requestUserMedia,
                enumerateDevices: function() {
                  return new Promise(function(resolve) {
                    var kinds = { audio: 'audioinput', video: 'videoinput' };
                    return MediaStreamTrack.getSources(function(devices) {
                      resolve(
                        devices.map(function(device) {
                          return {
                            label: device.label,
                            kind: kinds[device.kind],
                            id: device.id,
                            deviceId: device.id,
                            groupId: ''
                          };
                        })
                      );
                    });
                  });
                }
              })),
            (attachMediaStream = function(element, stream) {
              if (element && element.parentNode) {
                var streamId;
                null === stream
                  ? (streamId = '')
                  : (void 0 !== stream.enableSoundTracks &&
                      stream.enableSoundTracks(!0),
                    (streamId = stream.id));
                var elementId =
                    0 === element.id.length
                      ? Math.random()
                          .toString(36)
                          .slice(2)
                      : element.id,
                  nodeName = element.nodeName.toLowerCase();
                if ('object' !== nodeName) {
                  var tag;
                  switch (nodeName) {
                    case 'audio':
                      tag = AdapterJS.WebRTCPlugin.TAGS.AUDIO;
                      break;
                    case 'video':
                      tag = AdapterJS.WebRTCPlugin.TAGS.VIDEO;
                      break;
                    default:
                      tag = AdapterJS.WebRTCPlugin.TAGS.NONE;
                  }
                  var frag = document.createDocumentFragment(),
                    temp = document.createElement('div'),
                    classHTML = '';
                  for (
                    element.className
                      ? (classHTML = 'class="' + element.className + '" ')
                      : element.attributes &&
                        element.attributes.class &&
                        (classHTML =
                          'class="' + element.attributes.class.value + '" '),
                      temp.innerHTML =
                        '<object id="' +
                        elementId +
                        '" ' +
                        classHTML +
                        'type="' +
                        AdapterJS.WebRTCPlugin.pluginInfo.type +
                        '"><param name="pluginId" value="' +
                        elementId +
                        '" /> <param name="pageId" value="' +
                        AdapterJS.WebRTCPlugin.pageId +
                        '" /> <param name="windowless" value="true" /> <param name="streamId" value="' +
                        streamId +
                        '" /> <param name="tag" value="' +
                        tag +
                        '" /> </object>';
                    temp.firstChild;

                  )
                    frag.appendChild(temp.firstChild);
                  var height = '',
                    width = '';
                  element.clientWidth || element.clientHeight
                    ? ((width = element.clientWidth),
                      (height = element.clientHeight))
                    : (element.width || element.height) &&
                      ((width = element.width), (height = element.height)),
                    element.parentNode.insertBefore(frag, element),
                    (frag = document.getElementById(elementId)),
                    (frag.width = width),
                    (frag.height = height),
                    element.parentNode.removeChild(element);
                } else {
                  for (
                    var children = element.children, i = 0;
                    i !== children.length;
                    ++i
                  )
                    if ('streamId' === children[i].name) {
                      children[i].value = streamId;
                      break;
                    }
                  element.setStreamId(streamId);
                }
                var newElement = document.getElementById(elementId);
                return (
                  AdapterJS.forwardEventHandlers(
                    newElement,
                    element,
                    Object.getPrototypeOf(element)
                  ),
                  newElement
                );
              }
            }),
            (reattachMediaStream = function(to, from) {
              for (
                var stream = null, children = from.children, i = 0;
                i !== children.length;
                ++i
              )
                if ('streamId' === children[i].name) {
                  AdapterJS.WebRTCPlugin.WaitForPluginReady(),
                    (stream = AdapterJS.WebRTCPlugin.plugin.getStreamWithId(
                      AdapterJS.WebRTCPlugin.pageId,
                      children[i].value
                    ));
                  break;
                }
              if (null !== stream) return attachMediaStream(to, stream);
            }),
            (window.attachMediaStream = attachMediaStream),
            (window.reattachMediaStream = reattachMediaStream),
            (window.getUserMedia = getUserMedia),
            (AdapterJS.attachMediaStream = attachMediaStream),
            (AdapterJS.reattachMediaStream = reattachMediaStream),
            (AdapterJS.getUserMedia = getUserMedia),
            (AdapterJS.forwardEventHandlers = function(
              destElem,
              srcElem,
              prototype
            ) {
              var properties = Object.getOwnPropertyNames(prototype);
              for (var prop in properties)
                if (prop) {
                  var propName = properties[prop];
                  'function' == typeof propName.slice &&
                    'on' === propName.slice(0, 2) &&
                    'function' == typeof srcElem[propName] &&
                    AdapterJS.addEvent(
                      destElem,
                      propName.slice(2),
                      srcElem[propName]
                    );
                }
              var subPrototype = Object.getPrototypeOf(prototype);
              subPrototype &&
                AdapterJS.forwardEventHandlers(destElem, srcElem, subPrototype);
            }),
            (RTCIceCandidate = function(candidate) {
              return (
                candidate.sdpMid || (candidate.sdpMid = ''),
                AdapterJS.WebRTCPlugin.WaitForPluginReady(),
                AdapterJS.WebRTCPlugin.plugin.ConstructIceCandidate(
                  candidate.sdpMid,
                  candidate.sdpMLineIndex,
                  candidate.candidate
                )
              );
            }),
            AdapterJS.addEvent(
              document,
              'readystatechange',
              AdapterJS.WebRTCPlugin.injectPlugin
            ),
            AdapterJS.WebRTCPlugin.injectPlugin();
        }
      }),
      (AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb =
        AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb ||
        function() {
          AdapterJS.addEvent(
            document,
            'readystatechange',
            AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv
          ),
            AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv();
        }),
      (AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv = function() {
        if (!AdapterJS.options.hidePluginInstallPrompt) {
          var downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLink;
          if (downloadLink) {
            var popupString;
            (popupString = AdapterJS.WebRTCPlugin.pluginInfo.portalLink
              ? 'This website requires you to install the  <a href="' +
                AdapterJS.WebRTCPlugin.pluginInfo.portalLink +
                '" target="_blank">' +
                AdapterJS.WebRTCPlugin.pluginInfo.companyName +
                ' WebRTC Plugin</a> to work on this browser.'
              : AdapterJS.TEXT.PLUGIN.REQUIRE_INSTALLATION),
              AdapterJS.renderNotificationBar(
                popupString,
                AdapterJS.TEXT.PLUGIN.BUTTON,
                function() {
                  window.open(downloadLink, '_top');
                  var pluginInstallInterval = setInterval(function() {
                    'IE' !== AdapterJS.webrtcDetectedBrowser &&
                      navigator.plugins.refresh(!1),
                      AdapterJS.WebRTCPlugin.isPluginInstalled(
                        AdapterJS.WebRTCPlugin.pluginInfo.prefix,
                        AdapterJS.WebRTCPlugin.pluginInfo.plugName,
                        AdapterJS.WebRTCPlugin.pluginInfo.type,
                        function() {
                          clearInterval(pluginInstallInterval),
                            AdapterJS.WebRTCPlugin.defineWebRTCInterface();
                        },
                        function() {}
                      );
                  }, 500);
                }
              );
          } else
            AdapterJS.renderNotificationBar(
              AdapterJS.TEXT.PLUGIN.NOT_SUPPORTED
            );
        }
      }),
      AdapterJS.WebRTCPlugin.isPluginInstalled(
        AdapterJS.WebRTCPlugin.pluginInfo.prefix,
        AdapterJS.WebRTCPlugin.pluginInfo.plugName,
        AdapterJS.WebRTCPlugin.pluginInfo.type,
        AdapterJS.WebRTCPlugin.defineWebRTCInterface,
        AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb
      )),
  'undefined' != typeof exports && (module.exports = AdapterJS);
