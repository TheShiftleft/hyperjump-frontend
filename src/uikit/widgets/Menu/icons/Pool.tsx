import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 20 20" {...props}>
      <path
        d="M10 1.30601C11.174 1.30601 12.313 1.53601 13.384 1.98901C14.419 2.42701 15.349 3.05401 16.148 3.85301C16.947 4.65201 17.574 5.58201 18.012 6.61701C18.465 7.68801 18.695 8.82701 18.695 10.001C18.695 11.238 18.441 12.433 17.939 13.553C17.698 14.09 17.401 14.606 17.055 15.084C16.712 15.559 16.319 16.001 15.888 16.399C14.28 17.88 12.189 18.695 10.001 18.695C7.81301 18.695 5.72201 17.879 4.11301 16.398C3.68201 16.001 3.28901 15.558 2.94601 15.083C2.60001 14.604 2.30301 14.089 2.06201 13.552C1.56001 12.432 1.30601 11.237 1.30601 10C1.30601 8.82601 1.53601 7.68701 1.98901 6.61601C2.42701 5.58101 3.05401 4.65101 3.85301 3.85201C4.65201 3.05301 5.58201 2.42601 6.61701 1.98801C7.68701 1.53601 8.82601 1.30601 10 1.30601ZM10 0.51001C4.75901 0.51001 0.51001 4.75901 0.51001 10C0.51001 12.762 1.69001 15.249 3.57401 16.983C5.26401 18.54 7.52101 19.49 10.001 19.49C12.48 19.49 14.737 18.54 16.427 16.983C18.311 15.249 19.491 12.762 19.491 10C19.49 4.75901 15.241 0.51001 10 0.51001Z"
        fill="#44C4E2"
      />
      <path
        d="M10 19.5C7.609 19.5 5.324 18.609 3.567 16.99C2.61 16.109 1.856 15.063 1.327 13.881C0.778 12.657 0.5 11.352 0.5 10C0.5 8.718 0.751 7.473 1.247 6.302C1.725 5.171 2.41 4.155 3.283 3.282C4.156 2.409 5.171 1.725 6.303 1.246C7.473 0.751 8.718 0.5 10 0.5C11.282 0.5 12.527 0.751 13.698 1.247C14.829 1.725 15.845 2.41 16.718 3.283C17.591 4.156 18.275 5.171 18.754 6.303C19.249 7.473 19.5 8.718 19.5 10C19.5 11.352 19.222 12.658 18.673 13.881C18.143 15.063 17.389 16.109 16.432 16.99C14.675 18.609 12.391 19.5 10 19.5ZM10 0.52C8.72 0.52 7.479 0.771 6.31 1.265C5.181 1.742 4.167 2.426 3.297 3.297C2.427 4.168 1.742 5.181 1.265 6.31C0.771 7.479 0.52 8.72 0.52 10C0.52 11.349 0.797 12.652 1.345 13.873C1.874 15.053 2.626 16.096 3.581 16.976C5.335 18.591 7.615 19.481 10.001 19.481C12.387 19.481 14.667 18.592 16.42 16.977C17.375 16.098 18.127 15.054 18.656 13.874C19.203 12.653 19.481 11.35 19.481 10.001C19.481 8.721 19.23 7.48 18.736 6.311C18.259 5.182 17.575 4.168 16.704 3.298C15.833 2.427 14.82 1.744 13.691 1.266C12.521 0.771 11.28 0.52 10 0.52ZM10 18.704C7.809 18.704 5.716 17.887 4.106 16.404C3.674 16.006 3.281 15.564 2.938 15.088C2.592 14.609 2.294 14.093 2.053 13.555C1.55 12.435 1.296 11.239 1.296 10C1.296 8.825 1.526 7.685 1.98 6.612C2.418 5.576 3.046 4.645 3.846 3.845C4.646 3.045 5.577 2.418 6.613 1.979C7.685 1.526 8.825 1.296 10 1.296C11.175 1.296 12.315 1.526 13.388 1.98C14.424 2.418 15.355 3.046 16.155 3.846C16.955 4.646 17.582 5.577 18.021 6.613C18.475 7.686 18.705 8.825 18.705 10.001C18.705 11.24 18.45 12.436 17.948 13.557C17.707 14.095 17.409 14.611 17.063 15.09C16.72 15.566 16.326 16.008 15.894 16.406C14.284 17.888 12.191 18.704 10 18.704ZM10 1.316C8.827 1.316 7.69 1.546 6.62 1.998C5.586 2.435 4.657 3.061 3.859 3.859C3.061 4.657 2.435 5.586 1.998 6.62C1.545 7.69 1.316 8.827 1.316 10C1.316 11.236 1.57 12.429 2.071 13.547C2.312 14.084 2.609 14.598 2.954 15.077C3.297 15.551 3.689 15.993 4.12 16.39C5.727 17.869 7.815 18.684 10.001 18.684C12.187 18.684 14.275 17.869 15.881 16.39C16.312 15.993 16.704 15.551 17.047 15.077C17.392 14.599 17.689 14.084 17.93 13.547C18.431 12.429 18.685 11.235 18.685 9.999C18.685 8.826 18.456 7.689 18.003 6.619C17.566 5.585 16.939 4.656 16.142 3.858C15.344 3.06 14.415 2.434 13.381 1.997C12.31 1.545 11.173 1.316 10 1.316Z"
        fill="#44C4E2"
      />
      <path
        d="M12.966 14.654C12.995 14.654 13.021 14.682 13.042 14.702L15.25 16.922C13.745 18.064 11.91 18.689 10 18.689C8.091 18.689 6.255 18.07 4.75 16.928L6.957 14.701C6.977 14.681 7.004 14.654 7.033 14.654H12.98H12.966ZM12.966 13.893H7.033C6.793 13.893 6.564 13.988 6.394 14.157L3.573 16.982C5.264 18.54 7.521 19.49 10 19.49C12.479 19.49 14.736 18.54 16.426 16.983L13.605 14.157C13.436 13.988 13.206 13.893 12.966 13.893Z"
        fill="#44C4E2"
      />
      <path
        d="M10 1.30601C11.909 1.30601 13.745 1.92701 15.25 3.06901L13.055 5.29701C13.026 5.32601 12.988 5.37101 12.948 5.37101H7.096C7.027 5.37101 6.962 5.31501 6.913 5.26601L4.75 3.08401C6.255 1.94101 8.091 1.30601 10 1.30601ZM10 0.51001C7.521 0.51001 5.264 1.46101 3.573 3.01701L6.35 5.81001C6.548 6.00801 6.816 6.13101 7.097 6.13101H12.948C13.2 6.13101 13.441 6.01901 13.619 5.84101L16.427 3.02201C14.736 1.46601 12.479 0.51001 10 0.51001Z"
        fill="#44C4E2"
      />
      <path d="M10.393 14.502H9.63202V19.22H10.393V14.502Z" fill="#44C4E2" />
      <path d="M7.80501 14.502H7.04401V18.916H7.80501V14.502Z" fill="#44C4E2" />
      <path d="M12.98 14.502H12.219V18.916H12.98V14.502Z" fill="#44C4E2" />
      <path d="M16.9169 11.6473L16.3541 12.2101L18.0858 13.9418L18.6486 13.379L16.9169 11.6473Z" fill="#44C4E2" />
      <path d="M3.08264 11.6475L1.35095 13.3792L1.9138 13.942L3.64549 12.2103L3.08264 11.6475Z" fill="#44C4E2" />
      <path
        d="M5.16501 2.70599L4.21701 2.89199C4.21701 2.89199 3.49601 3.99499 3.61501 3.99499C3.62701 3.99499 3.64701 3.98399 3.67701 3.95999C3.75601 3.89699 3.87301 3.86699 4.00201 3.86699C4.23901 3.86699 4.51901 3.96599 4.69301 4.13899C4.74901 4.19499 4.81701 4.21799 4.88801 4.21799C5.16001 4.21799 5.47601 3.87599 5.29201 3.70699C5.06001 3.49399 4.76101 2.99099 5.16501 2.70599Z"
        fill="#44C4E2"
      />
      <path
        d="M14.83 2.70599C15.235 2.98999 14.935 3.49399 14.703 3.70699C14.471 3.91999 15.033 4.40799 15.302 4.13899C15.571 3.86999 16.096 3.78099 16.318 3.95999C16.651 4.22699 15.778 2.89199 15.778 2.89199L14.83 2.70599Z"
        fill="#44C4E2"
      />
      <path
        d="M15.107 4.22799C15.073 4.22799 15.038 4.22299 15.001 4.21299C14.834 4.16599 14.678 4.02099 14.645 3.88199C14.628 3.80999 14.646 3.74699 14.697 3.69999C14.863 3.54699 15.034 3.27599 15.019 3.04099C15.01 2.90899 14.945 2.79899 14.825 2.71499L14.787 2.68799L15.785 2.88299L15.787 2.88699C15.789 2.88999 15.959 3.14999 16.118 3.41399C16.445 3.95599 16.41 3.98699 16.396 3.99999C16.382 4.01299 16.357 4.00399 16.312 3.96799C16.09 3.78999 15.574 3.88099 15.309 4.14699C15.255 4.19999 15.185 4.22799 15.107 4.22799ZM14.87 2.72399C14.973 2.80799 15.03 2.91399 15.038 3.03899C15.054 3.28099 14.879 3.55799 14.71 3.71399C14.665 3.75599 14.649 3.81199 14.664 3.87599C14.695 4.00599 14.848 4.14799 15.006 4.19199C15.12 4.22399 15.223 4.20299 15.295 4.13099C15.566 3.85999 16.095 3.76699 16.325 3.95099C16.373 3.98899 16.383 3.98399 16.383 3.98399C16.413 3.95599 16.193 3.54299 15.773 2.89999L14.87 2.72399Z"
        fill="#44C4E2"
      />
      <path
        d="M17.556 5.582C17.835 5.99 17.664 6.522 17.321 6.86C17.097 7.081 17.454 7.774 17.724 7.506C17.935 7.297 18.208 7.15 18.353 7.395C18.571 7.762 18.223 6.205 18.223 6.205L17.556 5.582Z"
        fill="#44C4E2"
      />
      <path
        d="M2.44498 5.582C2.16598 5.99 2.34498 6.522 2.68798 6.86C2.91198 7.081 2.55498 7.774 2.28498 7.506C2.07398 7.298 1.80098 7.151 1.65498 7.396C1.43698 7.763 1.78498 6.206 1.78498 6.206L2.44498 5.582Z"
        fill="#44C4E2"
      />
      <path
        d="M17.556 5.582C17.835 5.99 17.664 6.522 17.321 6.86C17.097 7.081 17.454 7.774 17.724 7.506C17.935 7.297 18.208 7.15 18.353 7.395C18.571 7.762 18.223 6.205 18.223 6.205L17.556 5.582Z"
        fill="#44C4E2"
      />
      <path
        d="M2.44498 5.582C2.16598 5.99 2.34498 6.522 2.68798 6.86C2.91198 7.081 2.55498 7.774 2.28498 7.506C2.07398 7.298 1.80098 7.151 1.65498 7.396C1.43698 7.763 1.78498 6.206 1.78498 6.206L2.44498 5.582Z"
        fill="#44C4E2"
      />
      <path
        d="M17.556 14.426C17.835 14.018 17.664 13.486 17.321 13.148C17.097 12.927 17.454 12.234 17.724 12.502C17.935 12.711 18.208 12.858 18.353 12.613C18.571 12.246 18.223 13.803 18.223 13.803L17.556 14.426Z"
        fill="#44C4E2"
      />
      <path
        d="M2.44502 14.426C2.16602 14.018 2.34502 13.486 2.68802 13.148C2.91202 12.927 2.55502 12.234 2.28502 12.502C2.07402 12.711 1.80102 12.858 1.65602 12.613C1.43802 12.246 1.78602 13.803 1.78602 13.803L2.44502 14.426Z"
        fill="#44C4E2"
      />
      <path
        d="M17.556 14.426C17.835 14.018 17.664 13.486 17.321 13.148C17.097 12.927 17.454 12.234 17.724 12.502C17.935 12.711 18.208 12.858 18.353 12.613C18.571 12.246 18.223 13.803 18.223 13.803L17.556 14.426Z"
        fill="#44C4E2"
      />
      <path
        d="M17.497 14.494L17.548 14.42C17.751 14.122 17.765 13.599 17.314 13.155C17.241 13.083 17.221 12.955 17.26 12.806C17.301 12.651 17.411 12.475 17.544 12.438C17.611 12.42 17.675 12.439 17.731 12.495C17.828 12.591 18.015 12.749 18.178 12.729C18.246 12.72 18.302 12.68 18.345 12.608C18.374 12.559 18.394 12.541 18.412 12.549C18.43 12.556 18.473 12.573 18.358 13.195C18.302 13.499 18.234 13.802 18.234 13.805L18.233 13.808L18.231 13.81L17.497 14.494ZM17.593 12.45C17.579 12.45 17.564 12.452 17.55 12.456C17.439 12.486 17.325 12.635 17.28 12.81C17.243 12.952 17.261 13.073 17.329 13.14C17.507 13.315 17.632 13.535 17.682 13.758C17.731 13.978 17.704 14.187 17.604 14.367L18.215 13.796C18.382 13.045 18.443 12.581 18.405 12.565C18.405 12.565 18.393 12.564 18.362 12.616C18.316 12.693 18.255 12.737 18.181 12.747C18.011 12.769 17.817 12.606 17.718 12.508C17.679 12.47 17.637 12.45 17.593 12.45Z"
        fill="#A1A1A1"
      />
      <path
        d="M2.44502 14.426C2.16602 14.018 2.34502 13.486 2.68802 13.148C2.91202 12.927 2.55502 12.234 2.28502 12.502C2.07402 12.711 1.80102 12.858 1.65602 12.613C1.43802 12.246 1.78602 13.803 1.78602 13.803L2.44502 14.426Z"
        fill="#44C4E2"
      />
      <path
        d="M2.505 14.496L1.776 13.806L1.775 13.803C1.774 13.8 1.707 13.497 1.651 13.193C1.536 12.571 1.579 12.554 1.597 12.547C1.615 12.54 1.635 12.558 1.664 12.606C1.706 12.678 1.763 12.718 1.831 12.727C1.993 12.748 2.181 12.59 2.278 12.493C2.334 12.438 2.399 12.418 2.465 12.436C2.598 12.472 2.709 12.649 2.749 12.804C2.788 12.954 2.768 13.081 2.695 13.153C2.377 13.467 2.165 13.997 2.453 14.418L2.505 14.496ZM1.794 13.796L2.396 14.366C2.297 14.187 2.272 13.978 2.323 13.758C2.375 13.536 2.502 13.317 2.68 13.14C2.748 13.073 2.766 12.952 2.729 12.81C2.683 12.635 2.57 12.487 2.459 12.456C2.399 12.44 2.342 12.457 2.291 12.508C2.191 12.607 1.998 12.769 1.828 12.747C1.754 12.737 1.693 12.693 1.647 12.616C1.616 12.563 1.604 12.565 1.604 12.565C1.566 12.581 1.627 13.045 1.794 13.796Z"
        fill="#A1A1A1"
      />
      <path
        d="M17.593 12.46C17.634 12.46 17.674 12.478 17.711 12.515C17.803 12.606 17.983 12.759 18.15 12.759C18.243 12.759 18.317 12.713 18.371 12.621C18.386 12.595 18.396 12.584 18.402 12.579C18.41 12.606 18.417 12.721 18.325 13.21C18.274 13.482 18.216 13.748 18.206 13.791L17.639 14.321C17.835 13.905 17.632 13.426 17.335 13.133C17.275 13.073 17.234 12.931 17.317 12.727C17.393 12.543 17.51 12.46 17.593 12.46ZM17.593 12.44C17.356 12.44 17.133 12.961 17.322 13.147C17.665 13.485 17.836 14.017 17.557 14.425L18.225 13.801C18.225 13.801 18.503 12.555 18.406 12.555C18.395 12.555 18.378 12.572 18.355 12.611C18.301 12.702 18.23 12.739 18.151 12.739C18.016 12.739 17.859 12.632 17.726 12.501C17.682 12.459 17.637 12.44 17.593 12.44Z"
        fill="#44C4E2"
      />
      <path
        d="M2.47898 12.371V12.46C2.47898 12.46 2.64698 12.543 2.72298 12.727C2.80698 12.931 2.74998 13.073 2.68998 13.132C2.27798 13.539 2.23198 14.007 2.37298 14.321L1.80798 13.79C1.79898 13.747 1.73798 13.481 1.68698 13.209C1.59598 12.72 1.60098 12.605 1.60898 12.578C1.61398 12.583 1.62398 12.595 1.63898 12.62C1.69298 12.711 1.76698 12.758 1.85998 12.758C2.02698 12.758 2.23798 12.605 2.32998 12.514C2.36698 12.478 2.32698 12.459 2.47898 12.459V12.371ZM2.41598 12.44C2.37198 12.44 2.32698 12.458 2.28398 12.5C2.15098 12.631 1.99398 12.738 1.85898 12.738C1.77998 12.738 1.70898 12.701 1.65498 12.61C1.63198 12.571 1.61498 12.554 1.60398 12.554C1.50698 12.554 1.78498 13.8 1.78498 13.8L2.44398 14.424C2.16498 14.016 2.34398 13.484 2.68698 13.146C2.87598 12.961 2.65298 12.441 2.41598 12.44Z"
        fill="#44C4E2"
      />
      <path
        d="M4.48798 16.067C4.34298 16.173 4.18898 16.285 4.03198 16.285C3.96798 16.285 3.90398 16.267 3.83998 16.222C3.82498 16.211 3.81398 16.206 3.80698 16.206C3.71798 16.206 4.37098 17.105 4.37098 17.105C4.37098 17.105 4.98298 17.333 5.13498 17.333C5.17798 17.333 5.18398 17.314 5.12598 17.266C4.86698 17.05 4.88398 16.741 4.97698 16.623C5.06998 16.506 4.48798 16.067 4.48798 16.067Z"
        fill="#44C4E2"
      />
      <path
        d="M14.86 17.323C14.84 17.323 14.837 17.319 14.836 17.319C14.836 17.319 14.834 17.308 14.875 17.274C15.144 17.05 15.116 16.733 15.026 16.618C15.019 16.61 15.017 16.599 15.019 16.585C15.037 16.445 15.453 16.122 15.507 16.08C15.646 16.182 15.803 16.296 15.963 16.296C16.033 16.296 16.098 16.275 16.16 16.231C16.175 16.22 16.183 16.218 16.186 16.217C16.194 16.269 15.902 16.706 15.617 17.098C15.572 17.114 15.002 17.323 14.86 17.323Z"
        fill="#44C4E2"
      />
      <path
        d="M15.507 16.091C15.646 16.193 15.802 16.304 15.963 16.304C16.034 16.304 16.103 16.282 16.166 16.238C16.168 16.237 16.17 16.235 16.172 16.234C16.142 16.316 15.949 16.623 15.611 17.089C15.549 17.112 14.998 17.313 14.86 17.313C14.856 17.313 14.853 17.313 14.85 17.313C14.854 17.307 14.863 17.297 14.882 17.282C15.034 17.156 15.082 17.011 15.096 16.911C15.112 16.795 15.088 16.68 15.034 16.612C15.029 16.606 15.027 16.597 15.029 16.586C15.043 16.469 15.368 16.198 15.507 16.091ZM15.507 16.067C15.507 16.067 14.926 16.506 15.018 16.624C15.11 16.742 15.128 17.05 14.869 17.267C14.811 17.315 14.817 17.334 14.86 17.334C15.011 17.334 15.624 17.106 15.624 17.106C15.624 17.106 16.277 16.207 16.188 16.207C16.181 16.207 16.171 16.212 16.155 16.223C16.091 16.268 16.027 16.286 15.963 16.286C15.806 16.285 15.651 16.173 15.507 16.067Z"
        fill="#44C4E2"
      />
      <path
        d="M5.36599 13.733C3.61399 13.733 2.18799 12.308 2.18799 10.556C2.18799 9.57101 2.63399 8.65701 3.41199 8.05001L3.68899 7.83401L4.79199 8.93201C5.24399 9.38401 5.84699 9.63201 6.48999 9.63201H8.43299L8.48999 9.96001C8.52699 10.17 8.54499 10.358 8.54499 10.553C8.54399 12.306 7.11899 13.733 5.36599 13.733ZM3.64199 8.91001C3.21999 9.35101 2.98399 9.93402 2.98399 10.555C2.98399 11.868 4.05299 12.937 5.36599 12.937C6.67899 12.937 7.74799 11.85 7.74799 10.535C7.74799 10.493 7.74699 10.545 7.74499 10.392H6.48899C5.63299 10.392 4.83099 10.078 4.22899 9.47702L3.64199 8.91001Z"
        fill="#44C4E2"
      />
      <path
        d="M14.634 13.734C12.882 13.734 11.456 12.308 11.456 10.556C11.456 10.354 11.475 10.152 11.513 9.955L11.575 9.632H13.52C14.163 9.632 14.766 9.384 15.217 8.933L16.316 7.836L16.593 8.053C17.368 8.66 17.813 9.573 17.813 10.557C17.812 12.309 16.386 13.734 14.634 13.734ZM12.255 10.393C12.253 10.545 12.252 10.496 12.252 10.539C12.252 11.853 13.321 12.93 14.634 12.93C15.947 12.93 17.016 11.866 17.016 10.552C17.016 9.932 16.781 9.353 16.36 8.912L15.778 9.477C15.177 10.078 14.374 10.393 13.519 10.393H12.255Z"
        fill="#44C4E2"
      />
      <path
        d="M13.519 10.393H6.48898C6.35798 10.393 6.22598 10.402 6.09598 10.387C6.06998 10.383 6.04398 10.388 6.01898 10.384C6.00598 10.383 5.99298 10.385 5.97998 10.383C5.95398 10.379 5.92798 10.39 5.90298 10.385C5.89098 10.383 5.88598 10.381 5.87398 10.381L5.84798 10.375C5.80998 10.375 5.78898 10.364 5.74898 10.354C5.72298 10.349 5.69798 10.336 5.67298 10.329C5.61098 10.313 5.54798 10.291 5.48598 10.271C5.46098 10.263 5.43498 10.252 5.40998 10.243C4.96898 10.086 4.55998 9.82701 4.22898 9.49601L3.37598 8.64601L1.75098 7.02101L2.31398 6.45801L3.93798 8.08201L4.79098 8.93201C5.03998 9.18101 5.34698 9.37401 5.67898 9.49201C5.69798 9.49901 5.71498 9.50501 5.73298 9.51001L5.73498 9.51101C5.78098 9.52601 5.82798 9.54001 5.87398 9.55201C5.89298 9.55701 5.91198 9.56201 5.92998 9.56601L5.93298 9.56701C5.96198 9.57401 5.98998 9.58001 6.01598 9.58601L6.01898 9.58701C6.02698 9.58901 6.03498 9.59001 6.04298 9.59101L6.04698 9.59201C6.06598 9.59601 6.08498 9.59901 6.10398 9.60201C6.11298 9.60301 6.12198 9.60501 6.13098 9.60601H6.13398C6.15298 9.60901 6.17198 9.61101 6.19198 9.61401C6.28998 9.62601 6.38998 9.63201 6.48898 9.63201H13.519C14.162 9.63201 14.765 9.38401 15.216 8.93301L16.066 8.08501L17.664 6.48801L18.227 7.05101L16.629 8.64801L15.778 9.47901C15.177 10.079 14.374 10.393 13.519 10.393Z"
        fill="#44C4E2"
      />
    </Svg>
  )
}

export default Icon
