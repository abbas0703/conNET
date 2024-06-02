
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import { Quaternion, Vector3 } from 'three'
import { myPlayer, usePlayerState } from 'playroomkit'
import soundIcon from '../assets/soundIcon.svg'

export default function CharacterModel({
  characterUrl = 'https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb',
  sharePos = false,
  player,
}) {
  const { scene } = useGLTF(characterUrl)
  const [modelReady, setModelReady] = useState(false)

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const group = useRef()
  const worldPos = new Vector3()
  const worldQua = new Quaternion()

  // helpers
  let newPos
  let newRot
  useFrame(() => {
    // local characgter saves pos and rot in player's state
    if (sharePos) {
      group.current.getWorldPosition(worldPos)
      player.setState('position', worldPos.toArray())
      group.current.getWorldQuaternion(worldQua)
      player.setState('rotation', worldQua.toArray())
    } else {
      // other characters read pos and rot from network
      newPos = player.getState('position')
      newPos && group.current.position.set(...newPos)
      newRot = player.getState('rotation')
      newRot && group.current.quaternion.set(...newRot)
    }
  })
  useEffect(() => {
    clone.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    setModelReady(true)
  }, [clone])

  const [isInAvatarMode] = usePlayerState(myPlayer(), 'avatarMode')
  const [thisModelInAvatarMode] = usePlayerState(player, 'avatarMode')

  useEffect(() => {
    if (thisModelInAvatarMode) {
      setModelReady(false)
    }
  }, [thisModelInAvatarMode])

  return (
    <group position={[0, -0.9, 0]} ref={group} name={`character-${player.id}`} dispose={null}>
      {modelReady && !isInAvatarMode && <PlayerName name={player.state.player_name} player={player} />}
      <primitive object={clone} />
    </group>
  )
}

const PlayerName = ({ name, player }) => {
  const [occluded, setOccluded] = useState(false)
  const [withMic] = usePlayerState(player, 'withVoiceChat')
  return (
    <Html style={{ transform: 'translate(-50%, 0)' }} position={[0, 2.25, 0]} occlude onOcclude={setOccluded} distanceFactor={5}>
      <div
        className='select-none text-center flex justify-center'
        style={{
          fontFamily: "''",
          opacity: occluded ? 0.5 : 1,
          WebkitTextStroke: '0.01rem #fff',
        }}
      >
        {name} <img src={soundIcon} className={`talking-icon ml-2 w-6 ${!withMic && 'hidden'}`} />
      </div>
    </Html>
  )
}
