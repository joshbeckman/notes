// Exports the Apple Music library to a Library.xml-compatible plist using the
// iTunesLibrary framework, replacing the GUI-scripted File > Library > Export
// Library... dance (which needed Accessibility permissions and a frontmost
// Music.app window). This needs only the one-time "Media & Apple Music"
// privacy permission and runs headless.
//
// Usage: swift utilities/export_music_library.swift [output-path]
//
// Only keys consumed by utilities/apple_music_library_parser are emitted,
// because the Ruby Structs use keyword_init and raise on unknown keys.
import Foundation
import iTunesLibrary

let outputPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Library.xml"

let lib = try ITLibrary(apiVersion: "1.1")
let songs = lib.allMediaItems.filter { $0.mediaKind == .kindSong }

// The framework has no per-track loved flag; the "Favorite Songs"
// distinguished playlist is the only place favorites are exposed.
let lovedIDs: Set<NSNumber> = Set(
    lib.allPlaylists
        .first { $0.distinguishedKind == .kindLovedSongs }?
        .items.map { $0.persistentID } ?? []
)

// allMediaItems includes catalog tracks referenced only by playlists (e.g.
// favorited-from-catalog duplicates). The old XML export marked these
// "Playlist Only"; membership in the distinguished Music playlist is the
// only way the framework distinguishes real library members.
let libraryIDs: Set<NSNumber> = Set(
    lib.allPlaylists
        .first { $0.distinguishedKind == .kindMusic }?
        .items.map { $0.persistentID } ?? []
)

func hexID(_ n: NSNumber) -> String {
    String(format: "%016llX", n.uint64Value)
}

var tracksDict = [String: Any](minimumCapacity: songs.count)
for t in songs {
    // XML exports use small sequential Track IDs; we reuse the persistent ID
    // as the Track ID since it only needs to be unique and consistent with
    // the Playlist Items references below.
    let trackID = NSNumber(value: t.persistentID.int64Value)
    var d: [String: Any] = [
        "Track ID": trackID,
        "Persistent ID": hexID(t.persistentID),
        "Name": t.title,
        "Genre": t.genre,
        "Total Time": t.totalTime,
        "Play Count": t.playCount,
        "Skip Count": t.skipCount,
        "Track Number": t.trackNumber,
        "Loved": lovedIDs.contains(t.persistentID),
        "Favorited": lovedIDs.contains(t.persistentID),
    ]
    if !libraryIDs.isEmpty && !libraryIDs.contains(t.persistentID) {
        d["Playlist Only"] = true
    }
    if let v = t.artist?.name { d["Artist"] = v }
    if let v = t.album.title { d["Album"] = v }
    if let v = t.album.albumArtist { d["Album Artist"] = v }
    if t.year > 0 { d["Year"] = t.year }
    if t.album.trackCount > 0 { d["Track Count"] = t.album.trackCount }
    if let v = t.lastPlayedDate { d["Play Date UTC"] = v }
    if let v = t.skipDate { d["Skip Date"] = v }
    if let v = t.addedDate { d["Date Added"] = v }
    if let v = t.modifiedDate { d["Date Modified"] = v }
    if let v = t.releaseDate { d["Release Date"] = v }
    if t.rating > 0 && !t.isRatingComputed { d["Rating"] = t.rating }
    if t.album.rating > 0 && !t.album.isRatingComputed { d["Album Rating"] = t.album.rating }
    if let v = t.kind { d["Kind"] = v }
    tracksDict[trackID.stringValue] = d
}

let songIDs = Set(songs.map { NSNumber(value: $0.persistentID.int64Value) })
var playlists = [[String: Any]]()
for p in lib.allPlaylists where p.isVisible {
    let items = p.items
        .map { NSNumber(value: $0.persistentID.int64Value) }
        .filter { songIDs.contains($0) }
        .map { ["Track ID": $0] }
    playlists.append([
        "Name": p.name,
        "Playlist Persistent ID": hexID(p.persistentID),
        "Distinguished Kind": p.distinguishedKind.rawValue,
        "Playlist Items": items,
    ])
}

let root: [String: Any] = [
    "Application Version": lib.applicationVersion,
    "Date": Date(),
    "Tracks": tracksDict,
    "Playlists": playlists,
]

let data = try PropertyListSerialization.data(fromPropertyList: root, format: .xml, options: 0)
try data.write(to: URL(fileURLWithPath: outputPath))

FileHandle.standardError.write(
    "Wrote \(songs.count) tracks, \(playlists.count) playlists to \(outputPath)\n".data(using: .utf8)!
)
